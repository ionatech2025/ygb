package com.ionatech.nac.ygb.domain.valueobjects;

import com.ionatech.nac.ygb.domain.model.BudgetPrioritySubmission;
import com.ionatech.nac.ygb.domain.model.LgoBudgetAllocation;
import com.ionatech.nac.ygb.domain.model.Submission;

/** Synced field-data payload for one hub export row, before tabular projection. */
public sealed interface ToolFieldDataRecord {

    record PdmForm(
            ToolDownloadDataset dataset,
            Submission submission,
            String districtName,
            String subcountyName,
            String parishName
    ) implements ToolFieldDataRecord {
        public PdmForm {
            if (dataset == null || submission == null) {
                throw new IllegalArgumentException("PDM form export record requires dataset and submission.");
            }
        }
    }

    record BudgetPriority(
            BudgetPrioritySubmission submission,
            String districtName,
            String subcountyName,
            String parishName
    ) implements ToolFieldDataRecord {
        public BudgetPriority {
            if (submission == null) {
                throw new IllegalArgumentException("Budget priority export record requires submission.");
            }
        }
    }

    record BudgetAllocation(
            Submission envelope,
            LgoBudgetAllocation allocation,
            String districtName,
            String subcountyName,
            String parishName
    ) implements ToolFieldDataRecord {
        public BudgetAllocation {
            if (envelope == null || allocation == null) {
                throw new IllegalArgumentException("Budget allocation export record requires envelope and allocation.");
            }
        }
    }
}
