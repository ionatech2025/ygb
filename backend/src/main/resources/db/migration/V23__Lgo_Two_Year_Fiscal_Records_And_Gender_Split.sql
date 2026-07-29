-- Rename beneficiary count fields and add young men count on existing LGO fiscal year JSON.
UPDATE lgo_submissions
SET fiscal_year_records = (
    SELECT COALESCE(jsonb_agg(transformed.record ORDER BY transformed.label), '[]'::jsonb)
    FROM (
        SELECT
            elem->>'fiscalYearLabel' AS label,
            jsonb_build_object(
                'fiscalYearLabel', elem->>'fiscalYearLabel',
                'expectedFunds', (elem->>'expectedFunds')::bigint,
                'actualFunds', (elem->>'actualFunds')::bigint,
                'totalBeneficiaryCount', (elem->>'totalBeneficiaryCount')::int,
                'beneficiariesUnder30Count',
                    COALESCE(
                        (elem->>'beneficiariesUnder30Count')::int,
                        (elem->>'youngPeopleCount')::int,
                        0
                    ),
                'beneficiaryYoungWomenCount',
                    COALESCE(
                        (elem->>'beneficiaryYoungWomenCount')::int,
                        (elem->>'youngWomenCount')::int,
                        0
                    ),
                'beneficiaryYoungMenCount',
                    COALESCE((elem->>'beneficiaryYoungMenCount')::int, 0),
                'totalParishesCount', (elem->>'totalParishesCount')::int,
                'fundedParishesCount', (elem->>'fundedParishesCount')::int
            ) AS record
        FROM jsonb_array_elements(fiscal_year_records) AS elem
    ) transformed
);

-- Seed submissions stored a single current-year block; add prior-year comparison stub.
UPDATE lgo_submissions
SET fiscal_year_records = fiscal_year_records || jsonb_build_array(
    jsonb_build_object(
        'fiscalYearLabel', '2024/25',
        'expectedFunds', 0,
        'actualFunds', 0,
        'totalBeneficiaryCount', 0,
        'beneficiariesUnder30Count', 0,
        'beneficiaryYoungWomenCount', 0,
        'beneficiaryYoungMenCount', 0,
        'totalParishesCount', 0,
        'fundedParishesCount', 0
    )
)
WHERE jsonb_array_length(fiscal_year_records) = 1
  AND fiscal_year_records->0->>'fiscalYearLabel' = '2025/26';
