package com.ionatech.nac.ygb.adapters.out.persistence;

import com.ionatech.nac.ygb.adapters.out.persistence.entity.BudgetPrioritySubmissionJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.entity.LgoBudgetAllocationJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.entity.SubmissionJpaEntity;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.BudgetPrioritySubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.LgoBudgetAllocationMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.mapper.SubmissionMapper;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.BudgetPrioritySubmissionJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.LgoBudgetAllocationJpaRepository;
import com.ionatech.nac.ygb.adapters.out.persistence.repository.SubmissionJpaRepository;
import com.ionatech.nac.ygb.application.ports.spi.ToolFieldDataExportRepositoryPort;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.model.Submission;
import com.ionatech.nac.ygb.domain.service.ToolDownloadCatalogue;
import com.ionatech.nac.ygb.domain.valueobjects.BudgetPriorityDashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.DashboardFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolDownloadDataset;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataFilter;
import com.ionatech.nac.ygb.domain.valueobjects.ToolFieldDataRecord;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ToolFieldDataExportRepositoryAdapter implements ToolFieldDataExportRepositoryPort {

    private final ToolDownloadCatalogue catalogue;
    private final SubmissionJpaRepository submissionJpaRepository;
    private final SubmissionMapper submissionMapper;
    private final BudgetPrioritySubmissionJpaRepository budgetPrioritySubmissionJpaRepository;
    private final BudgetPrioritySubmissionMapper budgetPrioritySubmissionMapper;
    private final LgoBudgetAllocationJpaRepository lgoBudgetAllocationJpaRepository;
    private final LgoBudgetAllocationMapper lgoBudgetAllocationMapper;

    @PersistenceContext
    private EntityManager entityManager;

    public ToolFieldDataExportRepositoryAdapter(
            ToolDownloadCatalogue catalogue,
            SubmissionJpaRepository submissionJpaRepository,
            SubmissionMapper submissionMapper,
            BudgetPrioritySubmissionJpaRepository budgetPrioritySubmissionJpaRepository,
            BudgetPrioritySubmissionMapper budgetPrioritySubmissionMapper,
            LgoBudgetAllocationJpaRepository lgoBudgetAllocationJpaRepository,
            LgoBudgetAllocationMapper lgoBudgetAllocationMapper
    ) {
        this.catalogue = catalogue;
        this.submissionJpaRepository = submissionJpaRepository;
        this.submissionMapper = submissionMapper;
        this.budgetPrioritySubmissionJpaRepository = budgetPrioritySubmissionJpaRepository;
        this.budgetPrioritySubmissionMapper = budgetPrioritySubmissionMapper;
        this.lgoBudgetAllocationJpaRepository = lgoBudgetAllocationJpaRepository;
        this.lgoBudgetAllocationMapper = lgoBudgetAllocationMapper;
    }

    @Override
    public List<ToolFieldDataRecord> findSyncedByDatasetAndFilter(
            ToolDownloadDataset dataset,
            ToolFieldDataFilter filter
    ) {
        Objects.requireNonNull(dataset, "dataset must not be null");
        ToolFieldDataFilter effective = filter == null ? ToolFieldDataFilter.empty() : filter;
        return switch (dataset) {
            case BYP, IYP, PC, LGO -> findSyncedPdmForms(dataset, effective);
            case BUDGET_PRIORITIES -> findBudgetPriorities(effective);
            case LGO_BUDGET_ALLOCATION -> findSyncedBudgetAllocations(effective);
        };
    }

    private List<ToolFieldDataRecord> findSyncedPdmForms(ToolDownloadDataset dataset, ToolFieldDataFilter filter) {
        FormType formType = catalogue.formType(dataset).orElseThrow();
        DashboardFilter dashboardFilter = toDashboardFilter(formType, filter);
        Map<String, Object> params = new HashMap<>();
        String where = DashboardFilterSqlSupport.whereClause(dashboardFilter, params)
                + " AND s.status = 'SYNCED' ";

        String sql = """
                SELECT s.id, d.name, sc.name, p.name
                FROM submissions s
                JOIN locations d ON d.id = s.district_id
                JOIN locations sc ON sc.id = s.subcounty_id
                JOIN locations p ON p.id = s.parish_id
                """ + where + """
                 ORDER BY s.form_completed_at DESC, s.id DESC
                """;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = bindAndList(sql, params);
        if (rows.isEmpty()) {
            return List.of();
        }

        List<UUID> ids = rows.stream().map(row -> toUuid(row[0])).toList();
        Map<UUID, SubmissionJpaEntity> entities = submissionJpaRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(SubmissionJpaEntity::getId, Function.identity()));

        List<ToolFieldDataRecord> records = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            UUID id = toUuid(row[0]);
            SubmissionJpaEntity entity = entities.get(id);
            if (entity == null) {
                continue;
            }
            Submission submission = submissionMapper.toDomain(entity);
            records.add(new ToolFieldDataRecord.PdmForm(
                    dataset,
                    submission,
                    (String) row[1],
                    (String) row[2],
                    (String) row[3]
            ));
        }
        return records;
    }

    private List<ToolFieldDataRecord> findBudgetPriorities(ToolFieldDataFilter filter) {
        BudgetPriorityDashboardFilter bpFilter = new BudgetPriorityDashboardFilter(
                null,
                filter.districtId(),
                filter.subcountyId(),
                filter.parishId(),
                null,
                null,
                filter.gender(),
                filter.ageGroup(),
                filter.financialYearPeriod()
        );
        Map<String, Object> params = new HashMap<>();
        String where = BudgetPriorityFilterSqlSupport.whereClause(bpFilter, params);
        String sql = """
                SELECT bps.bp_id,
                       dist.name,
                       sc.name,
                       p.name
                FROM budget_priority_submissions bps
                LEFT JOIN locations dist ON dist.id = (bps.demographic_data->>'districtId')::uuid
                LEFT JOIN locations sc ON sc.id = (bps.demographic_data->>'subcountyId')::uuid
                LEFT JOIN locations p ON p.id = (bps.demographic_data->>'parishId')::uuid
                """ + where + """
                 ORDER BY bps.submitted_at DESC, bps.bp_id DESC
                """;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = bindAndList(sql, params);
        if (rows.isEmpty()) {
            return List.of();
        }

        List<UUID> ids = rows.stream().map(row -> toUuid(row[0])).toList();
        Map<UUID, BudgetPrioritySubmissionJpaEntity> entities =
                budgetPrioritySubmissionJpaRepository.findAllById(ids).stream()
                        .collect(Collectors.toMap(BudgetPrioritySubmissionJpaEntity::getBpId, Function.identity()));

        List<ToolFieldDataRecord> records = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            BudgetPrioritySubmissionJpaEntity entity = entities.get(toUuid(row[0]));
            if (entity == null) {
                continue;
            }
            records.add(new ToolFieldDataRecord.BudgetPriority(
                    budgetPrioritySubmissionMapper.toDomain(entity),
                    (String) row[1],
                    (String) row[2],
                    (String) row[3]
            ));
        }
        return records;
    }

    private List<ToolFieldDataRecord> findSyncedBudgetAllocations(ToolFieldDataFilter filter) {
        DashboardFilter dashboardFilter = toDashboardFilter(FormType.LGO_BUDGET_ALLOCATION, filter);
        Map<String, Object> params = new HashMap<>();
        String where = DashboardFilterSqlSupport.whereClause(dashboardFilter, params)
                + " AND s.status = 'SYNCED' ";

        String sql = """
                SELECT s.id, lba.lba_id, d.name, sc.name, p.name
                FROM lgo_budget_allocations lba
                JOIN submissions s ON s.id = lba.submission_id
                JOIN locations d ON d.id = s.district_id
                JOIN locations sc ON sc.id = s.subcounty_id
                JOIN locations p ON p.id = s.parish_id
                """ + where + """
                 ORDER BY s.form_completed_at DESC, s.id DESC
                """;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = bindAndList(sql, params);
        if (rows.isEmpty()) {
            return List.of();
        }

        List<UUID> submissionIds = rows.stream().map(row -> toUuid(row[0])).toList();
        List<UUID> lbaIds = rows.stream().map(row -> toUuid(row[1])).toList();
        Map<UUID, SubmissionJpaEntity> submissions = submissionJpaRepository.findAllById(submissionIds).stream()
                .collect(Collectors.toMap(SubmissionJpaEntity::getId, Function.identity()));
        Map<UUID, LgoBudgetAllocationJpaEntity> allocations =
                lgoBudgetAllocationJpaRepository.findAllById(lbaIds).stream()
                        .collect(Collectors.toMap(LgoBudgetAllocationJpaEntity::getLbaId, Function.identity()));

        List<ToolFieldDataRecord> records = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            SubmissionJpaEntity submissionEntity = submissions.get(toUuid(row[0]));
            LgoBudgetAllocationJpaEntity allocationEntity = allocations.get(toUuid(row[1]));
            if (submissionEntity == null || allocationEntity == null) {
                continue;
            }
            records.add(new ToolFieldDataRecord.BudgetAllocation(
                    submissionMapper.toDomain(submissionEntity),
                    lgoBudgetAllocationMapper.toDomain(allocationEntity),
                    (String) row[2],
                    (String) row[3],
                    (String) row[4]
            ));
        }
        return records;
    }

    private static DashboardFilter toDashboardFilter(FormType formType, ToolFieldDataFilter filter) {
        return new DashboardFilter(
                filter.districtId(),
                filter.subcountyId(),
                filter.parishId(),
                formType,
                null,
                null,
                filter.gender(),
                filter.ageGroup(),
                null,
                filter.financialYearPeriod()
        );
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> bindAndList(String sql, Map<String, Object> params) {
        var query = entityManager.createNativeQuery(sql);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    private static UUID toUuid(Object value) {
        if (value instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(value.toString());
    }
}
