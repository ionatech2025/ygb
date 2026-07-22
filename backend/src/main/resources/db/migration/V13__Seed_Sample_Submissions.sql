-- V13: Seed demo submissions for admin dashboard charts and collector profile views.
-- Targets Default Collector (V2) plus any additional DATA_COLLECTOR accounts matched by phone.

-- Location chains mirrored into `locations` by V11 (Kampala Central + Ntungamo Bwongera/Kakiika).
-- Kampala: district → subcounty → parish → village
-- Ntungamo: district → subcounty → parish → village

DO $$
DECLARE
    default_collector UUID := '22222222-2222-2222-2222-222222222222';
    kampala_district UUID := '6a4ec61c-d428-4a51-8af0-721f7d03d492';
    kampala_subcounty UUID := '168009f9-1188-49fb-88e8-70c93e1b7be0';
    kampala_parish UUID := '9ffcadf2-8a59-46d6-8f3d-01ee344828d6';
    kampala_village UUID := '841802f1-87ab-4efd-83f2-c9156ed33459';
    ntungamo_district UUID := '699711bf-2a18-46d7-8011-df048a4ae509';
    ntungamo_subcounty UUID := '06fde045-e93c-4e36-8d42-03b6dacd461c';
    ntungamo_parish UUID := '88135553-37cd-413c-8b18-ab399d772f56';
    ntungamo_village UUID := '9e735a79-fa41-4143-8e88-f9f07dfca1c4';
BEGIN
    IF EXISTS (SELECT 1 FROM submissions WHERE id = 'a1000001-0001-4001-8001-000000000001') THEN
        RETURN;
    END IF;

    -- Default Collector (0771111111) — mix of form types, districts, and FY periods
    INSERT INTO submissions (
        id, collector_id, device_submission_id, form_completed_at, financial_year_period,
        status, district_id, subcounty_id, parish_id, village_id,
        respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at
    ) VALUES
    ('a1000001-0001-4001-8001-000000000001', default_collector, 'a1000001-0001-4001-8001-000000000101', TIMESTAMP '2026-03-10 09:30:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Grace Nakato', '0788000101', 'FEMALE', 'AGE_20_24', 'BYP', TIMESTAMP '2026-03-10 09:35:00'),
    ('a1000001-0001-4001-8001-000000000002', default_collector, 'a1000001-0001-4001-8001-000000000102', TIMESTAMP '2026-04-18 11:00:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'James Okello', '0788000102', 'MALE', 'AGE_25_29', 'BYP', TIMESTAMP '2026-04-18 11:05:00'),
    ('a1000001-0001-4001-8001-000000000003', default_collector, 'a1000001-0001-4001-8001-000000000103', TIMESTAMP '2026-05-22 14:15:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Sarah Ainomugisha', '0788000103', 'FEMALE', 'AGE_15_19', 'IYP', TIMESTAMP '2026-05-22 14:20:00'),
    ('a1000001-0001-4001-8001-000000000004', default_collector, 'a1000001-0001-4001-8001-000000000104', TIMESTAMP '2026-03-28 10:45:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Robert Tumusiime', '0788000104', 'MALE', 'AGE_30_AND_ABOVE', 'LGO', TIMESTAMP '2026-03-28 10:50:00'),
    ('a1000001-0001-4001-8001-000000000005', default_collector, 'a1000001-0001-4001-8001-000000000105', TIMESTAMP '2026-08-12 08:00:00', 'JUL_DEC_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Paul Ssempijja', '0788000105', 'MALE', 'AGE_30_AND_ABOVE', 'PC', TIMESTAMP '2026-08-12 08:05:00'),
    ('a1000001-0001-4001-8001-000000000006', default_collector, 'a1000001-0001-4001-8001-000000000106', TIMESTAMP '2026-10-05 16:30:00', 'JUL_DEC_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Betty Namukasa', '0788000106', 'FEMALE', 'AGE_20_24', 'BYP', TIMESTAMP '2026-10-05 16:35:00');

    INSERT INTO byp_submissions (
        id, exact_age, fund_receipt_duration, received_actual_amount_requested, cash_amount_received,
        instalment_period, service_rating, performance_rating, group_organized_transparently,
        received_bds, bds_services, improvement_suggestion
    ) VALUES
    ('a1000001-0001-4001-8001-000000000001', 22, 'ONE_WEEK', TRUE, 500000, 'MONTHLY', 'VERY_GOOD', 'GOOD', TRUE, TRUE, '["TRAINING"]'::jsonb, 'Provide more technical support.'),
    ('a1000001-0001-4001-8001-000000000002', 27, 'TWO_WEEKS', TRUE, 750000, 'QUARTERLY', 'GOOD', 'GOOD', TRUE, FALSE, NULL, 'Improve disbursement timelines.'),
    ('a1000001-0001-4001-8001-000000000006', 23, 'ONE_WEEK', TRUE, 600000, 'MONTHLY', 'VERY_GOOD', 'VERY_GOOD', TRUE, TRUE, '["MENTORSHIP"]'::jsonb, 'Expand youth outreach.');

    INSERT INTO iyp_submissions (
        id, aware_of_pdm, eligible_criteria_aware, applied_for_fund, accessed_fund,
        rejection_narrative, reasons_for_not_applying, information_channels,
        difficulties_faced, limitation_explanation, improvement_suggestion
    ) VALUES (
        'a1000001-0001-4001-8001-000000000003',
        TRUE, TRUE, TRUE, FALSE,
        'Application rejected without clear feedback.',
        NULL,
        '["RADIO"]'::jsonb,
        '["LIMITATION_IN_AMOUNT"]'::jsonb,
        'Explain limitation text here.',
        'Improve awareness campaigns.'
    );

    INSERT INTO lgo_submissions (
        id, fiscal_year_records, funds_allocated_equitably, allocated_funds_sufficient,
        adequate_utilisation_oversight, transparent_beneficiary_selection,
        funds_spent_as_required, economic_transformation, improvement_suggestion
    ) VALUES (
        'a1000001-0001-4001-8001-000000000004',
        '[{"fiscalYearLabel":"2025/26","expectedFunds":100000,"actualFunds":80000,"totalBeneficiaryCount":50,"youngPeopleCount":20,"youngWomenCount":20,"totalParishesCount":5,"fundedParishesCount":4}]'::jsonb,
        TRUE, TRUE, TRUE, TRUE,
        TRUE, TRUE,
        'Provide more monitoring tools.'
    );

    INSERT INTO pc_submissions (
        id, amount_expected, amount_received, total_beneficiaries, youth_beneficiaries,
        young_women_beneficiaries, obstacles_description, spending_targeted_to_most_in_need,
        pdc_total_members, pdc_youth_members, pdc_women_members, pdc_training_received,
        pdc_training_areas, pdc_effectiveness_rating, monitored_by, monitoring_method,
        report_shared_with_respondent, improvements_seen, progress_reports_submitted,
        self_reliance_beneficiaries_count, self_reliance_group_projects_count
    ) VALUES (
        'a1000001-0001-4001-8001-000000000005',
        1500000, 1500000, 100, 40, 30,
        'Lack of transport equipment is the main obstacle.',
        TRUE, 7, 3, 4, TRUE,
        '["FINANCIAL_LITERACY"]'::jsonb,
        'HIGHLY_EFFECTIVE',
        '["CAO"]'::jsonb,
        'Regular field checks performed.',
        TRUE, TRUE, TRUE,
        10, 8
    );

    -- Elijah Nyombi E (0757879098)
    IF EXISTS (SELECT 1 FROM users WHERE phone_number = '0757879098' AND role = 'DATA_COLLECTOR') THEN
        INSERT INTO submissions (
            id, collector_id, device_submission_id, form_completed_at, financial_year_period,
            status, district_id, subcounty_id, parish_id, village_id,
            respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at
        )
        SELECT * FROM (VALUES
            ('a2000002-0002-4002-8002-000000000001'::uuid, (SELECT id FROM users WHERE phone_number = '0757879098'), 'a2000002-0002-4002-8002-000000000101'::uuid, TIMESTAMP '2026-03-14 10:00:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Amina Katusiime', '0788000201', 'FEMALE', 'AGE_20_24', 'BYP', TIMESTAMP '2026-03-14 10:05:00'),
            ('a2000002-0002-4002-8002-000000000002'::uuid, (SELECT id FROM users WHERE phone_number = '0757879098'), 'a2000002-0002-4002-8002-000000000102'::uuid, TIMESTAMP '2026-04-20 13:00:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'David Muheebwa', '0788000202', 'MALE', 'AGE_15_19', 'IYP', TIMESTAMP '2026-04-20 13:05:00'),
            ('a2000002-0002-4002-8002-000000000003'::uuid, (SELECT id FROM users WHERE phone_number = '0757879098'), 'a2000002-0002-4002-8002-000000000103'::uuid, TIMESTAMP '2026-09-08 09:00:00', 'JUL_DEC_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Harriet Nalwoga', '0788000203', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO', TIMESTAMP '2026-09-08 09:05:00'),
            ('a2000002-0002-4002-8002-000000000004'::uuid, (SELECT id FROM users WHERE phone_number = '0757879098'), 'a2000002-0002-4002-8002-000000000104'::uuid, TIMESTAMP '2026-11-15 15:30:00', 'JUL_DEC_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Ivan Kato', '0788000204', 'MALE', 'AGE_30_AND_ABOVE', 'PC', TIMESTAMP '2026-11-15 15:35:00')
        ) AS v(id, collector_id, device_submission_id, form_completed_at, financial_year_period, status, district_id, subcounty_id, parish_id, village_id, respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at);

        INSERT INTO byp_submissions (id, exact_age, fund_receipt_duration, received_actual_amount_requested, cash_amount_received, instalment_period, service_rating, performance_rating, group_organized_transparently, received_bds, bds_services, improvement_suggestion)
        VALUES ('a2000002-0002-4002-8002-000000000001', 21, 'ONE_WEEK', TRUE, 450000, 'MONTHLY', 'GOOD', 'GOOD', TRUE, TRUE, '["TRAINING"]'::jsonb, 'More follow-up visits needed.');

        INSERT INTO iyp_submissions (id, aware_of_pdm, eligible_criteria_aware, applied_for_fund, accessed_fund, rejection_narrative, information_channels, difficulties_faced, limitation_explanation, improvement_suggestion)
        VALUES ('a2000002-0002-4002-8002-000000000002', TRUE, TRUE, FALSE, FALSE, NULL, '["COMMUNITY_MEETINGS"]'::jsonb, '["LACK_OF_INFORMATION"]'::jsonb, 'Need clearer eligibility guidance.', 'Run more community sensitisation.');

        INSERT INTO lgo_submissions (id, fiscal_year_records, funds_allocated_equitably, allocated_funds_sufficient, adequate_utilisation_oversight, transparent_beneficiary_selection, funds_spent_as_required, economic_transformation, improvement_suggestion)
        VALUES ('a2000002-0002-4002-8002-000000000003', '[{"fiscalYearLabel":"2025/26","expectedFunds":120000,"actualFunds":95000,"totalBeneficiaryCount":40,"youngPeopleCount":18,"youngWomenCount":15,"totalParishesCount":4,"fundedParishesCount":3}]'::jsonb, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 'Strengthen parish-level oversight.');

        INSERT INTO pc_submissions (id, amount_expected, amount_received, total_beneficiaries, youth_beneficiaries, young_women_beneficiaries, obstacles_description, spending_targeted_to_most_in_need, pdc_total_members, pdc_youth_members, pdc_women_members, pdc_training_received, pdc_training_areas, pdc_effectiveness_rating, monitored_by, monitoring_method, report_shared_with_respondent, improvements_seen, progress_reports_submitted, self_reliance_beneficiaries_count, self_reliance_group_projects_count)
        VALUES ('a2000002-0002-4002-8002-000000000004', 1200000, 1100000, 85, 35, 28, 'Delayed fund releases affected monitoring.', TRUE, 6, 2, 3, TRUE, '["BUSINESS_SKILLS"]'::jsonb, 'EFFECTIVE', '["SUBCOUNTY_CHIEF"]'::jsonb, 'Monthly review meetings.', TRUE, TRUE, TRUE, 8, 5);
    END IF;

    -- Katongole (0757131918)
    IF EXISTS (SELECT 1 FROM users WHERE phone_number = '0757131918' AND role = 'DATA_COLLECTOR') THEN
        INSERT INTO submissions (
            id, collector_id, device_submission_id, form_completed_at, financial_year_period,
            status, district_id, subcounty_id, parish_id, village_id,
            respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at
        )
        SELECT * FROM (VALUES
            ('a3000003-0003-4003-8003-000000000001'::uuid, (SELECT id FROM users WHERE phone_number = '0757131918'), 'a3000003-0003-4003-8003-000000000101'::uuid, TIMESTAMP '2026-02-25 08:30:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Joan Atuhaire', '0788000301', 'FEMALE', 'AGE_20_24', 'BYP', TIMESTAMP '2026-02-25 08:35:00'),
            ('a3000003-0003-4003-8003-000000000002'::uuid, (SELECT id FROM users WHERE phone_number = '0757131918'), 'a3000003-0003-4003-8003-000000000102'::uuid, TIMESTAMP '2026-05-05 12:00:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Keith Mugisha', '0788000302', 'MALE', 'AGE_15_19', 'IYP', TIMESTAMP '2026-05-05 12:05:00'),
            ('a3000003-0003-4003-8003-000000000003'::uuid, (SELECT id FROM users WHERE phone_number = '0757131918'), 'a3000003-0003-4003-8003-000000000103'::uuid, TIMESTAMP '2026-08-20 11:15:00', 'JUL_DEC_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Lydia Asiimwe', '0788000303', 'FEMALE', 'AGE_25_29', 'BYP', TIMESTAMP '2026-08-20 11:20:00'),
            ('a3000003-0003-4003-8003-000000000004'::uuid, (SELECT id FROM users WHERE phone_number = '0757131918'), 'a3000003-0003-4003-8003-000000000104'::uuid, TIMESTAMP '2026-10-28 14:45:00', 'JUL_DEC_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Moses Wasswa', '0788000304', 'MALE', 'AGE_30_AND_ABOVE', 'PC', TIMESTAMP '2026-10-28 14:50:00')
        ) AS v(id, collector_id, device_submission_id, form_completed_at, financial_year_period, status, district_id, subcounty_id, parish_id, village_id, respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at);

        INSERT INTO byp_submissions (id, exact_age, fund_receipt_duration, received_actual_amount_requested, cash_amount_received, instalment_period, service_rating, performance_rating, group_organized_transparently, received_bds, bds_services, improvement_suggestion)
        VALUES
        ('a3000003-0003-4003-8003-000000000001', 24, 'ONE_WEEK', TRUE, 520000, 'MONTHLY', 'VERY_GOOD', 'GOOD', TRUE, TRUE, '["TRAINING"]'::jsonb, 'Continue group mentoring.'),
        ('a3000003-0003-4003-8003-000000000003', 26, 'TWO_WEEKS', TRUE, 680000, 'QUARTERLY', 'GOOD', 'VERY_GOOD', TRUE, FALSE, NULL, 'Faster cash disbursement needed.');

        INSERT INTO iyp_submissions (id, aware_of_pdm, eligible_criteria_aware, applied_for_fund, accessed_fund, rejection_narrative, information_channels, difficulties_faced, limitation_explanation, improvement_suggestion)
        VALUES ('a3000003-0003-4003-8003-000000000002', TRUE, FALSE, TRUE, TRUE, NULL, '["SOCIAL_MEDIA"]'::jsonb, '["COMPLEX_APPLICATION"]'::jsonb, 'Application process was lengthy.', 'Simplify the application form.');

        INSERT INTO pc_submissions (id, amount_expected, amount_received, total_beneficiaries, youth_beneficiaries, young_women_beneficiaries, obstacles_description, spending_targeted_to_most_in_need, pdc_total_members, pdc_youth_members, pdc_women_members, pdc_training_received, pdc_training_areas, pdc_effectiveness_rating, monitored_by, monitoring_method, report_shared_with_respondent, improvements_seen, progress_reports_submitted, self_reliance_beneficiaries_count, self_reliance_group_projects_count)
        VALUES ('a3000003-0003-4003-8003-000000000004', 980000, 980000, 72, 30, 22, 'Limited transport for field verification.', TRUE, 5, 2, 2, FALSE, NULL, 'MODERATELY_EFFECTIVE', '["PARISH_CHIEF"]'::jsonb, 'Quarterly parish reviews.', TRUE, FALSE, TRUE, 6, 4);
    END IF;

    -- samuel (0767896608)
    IF EXISTS (SELECT 1 FROM users WHERE phone_number = '0767896608' AND role = 'DATA_COLLECTOR') THEN
        INSERT INTO submissions (
            id, collector_id, device_submission_id, form_completed_at, financial_year_period,
            status, district_id, subcounty_id, parish_id, village_id,
            respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at
        )
        SELECT * FROM (VALUES
            ('a4000004-0004-4004-8004-000000000001'::uuid, (SELECT id FROM users WHERE phone_number = '0767896608'), 'a4000004-0004-4004-8004-000000000101'::uuid, TIMESTAMP '2026-03-01 07:45:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Nancy Nabirye', '0788000401', 'FEMALE', 'AGE_20_24', 'BYP', TIMESTAMP '2026-03-01 07:50:00'),
            ('a4000004-0004-4004-8004-000000000002'::uuid, (SELECT id FROM users WHERE phone_number = '0767896608'), 'a4000004-0004-4004-8004-000000000102'::uuid, TIMESTAMP '2026-04-30 16:00:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Oscar Byaruhanga', '0788000402', 'MALE', 'AGE_30_AND_ABOVE', 'LGO', TIMESTAMP '2026-04-30 16:05:00'),
            ('a4000004-0004-4004-8004-000000000003'::uuid, (SELECT id FROM users WHERE phone_number = '0767896608'), 'a4000004-0004-4004-8004-000000000104'::uuid, TIMESTAMP '2026-09-25 10:30:00', 'JUL_DEC_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'Patricia Nambi', '0788000403', 'FEMALE', 'AGE_15_19', 'IYP', TIMESTAMP '2026-09-25 10:35:00'),
            ('a4000004-0004-4004-8004-000000000004'::uuid, (SELECT id FROM users WHERE phone_number = '0767896608'), 'a4000004-0004-4004-8004-000000000105'::uuid, TIMESTAMP '2026-12-01 13:00:00', 'JUL_DEC_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Quincy Rukundo', '0788000404', 'MALE', 'AGE_25_29', 'BYP', TIMESTAMP '2026-12-01 13:05:00')
        ) AS v(id, collector_id, device_submission_id, form_completed_at, financial_year_period, status, district_id, subcounty_id, parish_id, village_id, respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at);

        INSERT INTO byp_submissions (id, exact_age, fund_receipt_duration, received_actual_amount_requested, cash_amount_received, instalment_period, service_rating, performance_rating, group_organized_transparently, received_bds, bds_services, improvement_suggestion)
        VALUES
        ('a4000004-0004-4004-8004-000000000001', 22, 'ONE_WEEK', TRUE, 500000, 'MONTHLY', 'GOOD', 'GOOD', TRUE, TRUE, '["TRAINING"]'::jsonb, 'More youth enterprise support.'),
        ('a4000004-0004-4004-8004-000000000004', 28, 'ONE_WEEK', TRUE, 550000, 'MONTHLY', 'VERY_GOOD', 'GOOD', TRUE, TRUE, '["MARKET_LINKAGE"]'::jsonb, 'Link groups to buyers.');

        INSERT INTO lgo_submissions (id, fiscal_year_records, funds_allocated_equitably, allocated_funds_sufficient, adequate_utilisation_oversight, transparent_beneficiary_selection, funds_spent_as_required, economic_transformation, improvement_suggestion)
        VALUES ('a4000004-0004-4004-8004-000000000002', '[{"fiscalYearLabel":"2025/26","expectedFunds":90000,"actualFunds":90000,"totalBeneficiaryCount":35,"youngPeopleCount":15,"youngWomenCount":12,"totalParishesCount":3,"fundedParishesCount":3}]'::jsonb, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'Share best practices across parishes.');

        INSERT INTO iyp_submissions (id, aware_of_pdm, eligible_criteria_aware, applied_for_fund, accessed_fund, rejection_narrative, information_channels, difficulties_faced, limitation_explanation, improvement_suggestion)
        VALUES ('a4000004-0004-4004-8004-000000000003', TRUE, TRUE, TRUE, FALSE, 'Incomplete documentation cited.', '["PEERS"]'::jsonb, '["LACK_OF_COLLATERAL"]'::jsonb, 'Collateral requirements unclear.', 'Clarify collateral alternatives.');
    END IF;
END $$;
