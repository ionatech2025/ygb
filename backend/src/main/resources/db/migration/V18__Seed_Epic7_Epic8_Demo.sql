-- V18: Demo Budget Priorities and LGO Budget Allocation submissions for FY 2025/2026 dashboards.
-- Covers JUL_DEC_2025 and JAN_JUN_2026 (full 2025/26 financial year) across Kampala and Ntungamo.

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
    IF EXISTS (SELECT 1 FROM budget_priority_submissions WHERE bp_id = 'b7000001-0001-4001-8001-000000000001') THEN
        RETURN;
    END IF;

    -- Budget Priorities — JUL_DEC_2025 (Jul–Dec 2025 half of FY 2025/26)
    INSERT INTO budget_priority_submissions (
        bp_id, phone_number, section, priority_areas, demographic_data, financial_year_period, submitted_at
    ) VALUES
    ('b7000001-0001-4001-8001-000000000001', '0788100101', 'HEALTH', '{"rankedAreas":["PRIMARY_HEALTH_CARE","MATERNAL_HEALTH"]}'::jsonb,
        '{"fullName":"Grace Nakato","phoneNumber":"0788100101","ageGroup":"AGE_30_AND_ABOVE","gender":"FEMALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-08-15 10:30:00+00'),
    ('b7000001-0001-4001-8001-000000000002', '0788100102', 'HEALTH', '{"rankedAreas":["HOSPITAL_SERVICES","COMMUNITY_HEALTH"]}'::jsonb,
        '{"fullName":"Robert Tumusiime","phoneNumber":"0788100102","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-09-20 14:00:00+00'),
    ('b7000001-0001-4001-8001-000000000003', '0788100103', 'AGRICULTURE', '{"rankedAreas":["IRRIGATION","EXTENSION_SERVICES"]}'::jsonb,
        '{"fullName":"Paul Ssempijja","phoneNumber":"0788100103","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-10-10 09:15:00+00'),
    ('b7000001-0001-4001-8001-000000000004', '0788100104', 'AGRICULTURE', '{"rankedAreas":["SEEDS_INPUTS","MARKET_ACCESS"]}'::jsonb,
        '{"fullName":"Sarah Ainomugisha","phoneNumber":"0788100104","ageGroup":"AGE_25_29","gender":"FEMALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-11-05 11:45:00+00'),
    ('b7000001-0001-4001-8001-000000000005', '0788100105', 'EDUCATION', '{"rankedAreas":["PRIMARY_EDUCATION","TEACHER_SUPPORT"]}'::jsonb,
        '{"fullName":"Harriet Nalwoga","phoneNumber":"0788100105","ageGroup":"AGE_30_AND_ABOVE","gender":"FEMALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-08-28 08:00:00+00'),
    ('b7000001-0001-4001-8001-000000000006', '0788100106', 'EDUCATION', '{"rankedAreas":["SECONDARY_EDUCATION","SKILLS_TRAINING"]}'::jsonb,
        '{"fullName":"David Muheebwa","phoneNumber":"0788100106","ageGroup":"AGE_20_24","gender":"MALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-09-12 16:20:00+00'),
    ('b7000001-0001-4001-8001-000000000007', '0788100107', 'CLIMATE', '{"rankedAreas":["REFORESTATION","RENEWABLE_ENERGY"]}'::jsonb,
        '{"fullName":"Betty Namukasa","phoneNumber":"0788100107","ageGroup":"AGE_30_AND_ABOVE","gender":"FEMALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-10-22 13:30:00+00'),
    ('b7000001-0001-4001-8001-000000000008', '0788100108', 'CLIMATE', '{"rankedAreas":["WATER_CONSERVATION","DISASTER_PREPAREDNESS"]}'::jsonb,
        '{"fullName":"Ivan Kato","phoneNumber":"0788100108","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JUL_DEC_2025', TIMESTAMPTZ '2025-11-18 10:00:00+00');

    -- Budget Priorities — JAN_JUN_2026 (Jan–Jun 2026 half of FY 2025/26)
    INSERT INTO budget_priority_submissions (
        bp_id, phone_number, section, priority_areas, demographic_data, financial_year_period, submitted_at
    ) VALUES
    ('b7000001-0001-4001-8001-000000000009', '0788100109', 'HEALTH', '{"rankedAreas":["PRIMARY_HEALTH_CARE","COMMUNITY_HEALTH"]}'::jsonb,
        '{"fullName":"Amina Katusiime","phoneNumber":"0788100109","ageGroup":"AGE_20_24","gender":"FEMALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-01-20 09:00:00+00'),
    ('b7000001-0001-4001-8001-000000000010', '0788100110', 'HEALTH', '{"rankedAreas":["MATERNAL_HEALTH","HOSPITAL_SERVICES"]}'::jsonb,
        '{"fullName":"James Okello","phoneNumber":"0788100110","ageGroup":"AGE_25_29","gender":"MALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-02-14 11:30:00+00'),
    ('b7000001-0001-4001-8001-000000000011', '0788100111', 'AGRICULTURE', '{"rankedAreas":["EXTENSION_SERVICES","IRRIGATION"]}'::jsonb,
        '{"fullName":"Peter Okello","phoneNumber":"0788100111","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-03-08 15:45:00+00'),
    ('b7000001-0001-4001-8001-000000000012', '0788100112', 'AGRICULTURE', '{"rankedAreas":["MARKET_ACCESS","SEEDS_INPUTS"]}'::jsonb,
        '{"fullName":"Ruth Atuhaire","phoneNumber":"0788100112","ageGroup":"AGE_30_AND_ABOVE","gender":"FEMALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-04-25 08:30:00+00'),
    ('b7000001-0001-4001-8001-000000000013', '0788100113', 'EDUCATION', '{"rankedAreas":["TEACHER_SUPPORT","PRIMARY_EDUCATION"]}'::jsonb,
        '{"fullName":"Moses Ssenyonga","phoneNumber":"0788100113","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-01-30 10:15:00+00'),
    ('b7000001-0001-4001-8001-000000000014', '0788100114', 'EDUCATION', '{"rankedAreas":["SKILLS_TRAINING","SECONDARY_EDUCATION"]}'::jsonb,
        '{"fullName":"Florence Kabarungi","phoneNumber":"0788100114","ageGroup":"AGE_25_29","gender":"FEMALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-05-10 14:00:00+00'),
    ('b7000001-0001-4001-8001-000000000015', '0788100115', 'CLIMATE', '{"rankedAreas":["DISASTER_PREPAREDNESS","WATER_CONSERVATION"]}'::jsonb,
        '{"fullName":"Catherine Nalubega","phoneNumber":"0788100115","ageGroup":"AGE_30_AND_ABOVE","gender":"FEMALE","districtId":"6a4ec61c-d428-4a51-8af0-721f7d03d492"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-02-28 09:45:00+00'),
    ('b7000001-0001-4001-8001-000000000016', '0788100116', 'CLIMATE', '{"rankedAreas":["REFORESTATION","RENEWABLE_ENERGY"]}'::jsonb,
        '{"fullName":"Geoffrey Byaruhanga","phoneNumber":"0788100116","ageGroup":"AGE_30_AND_ABOVE","gender":"MALE","districtId":"699711bf-2a18-46d7-8011-df048a4ae509"}'::jsonb,
        'JAN_JUN_2026', TIMESTAMPTZ '2026-06-05 12:00:00+00');

    -- LGO Budget Allocation — submission envelopes (JUL_DEC_2025 + JAN_JUN_2026)
    INSERT INTO submissions (
        id, collector_id, device_submission_id, form_completed_at, financial_year_period,
        status, district_id, subcounty_id, parish_id, village_id,
        respondent_name, respondent_phone, respondent_gender, respondent_age_group, form_type, synced_at
    ) VALUES
    ('b8000001-0001-4001-8001-000000000001', default_collector, 'b8000001-0001-4001-8001-000000000101', TIMESTAMP '2025-08-05 09:00:00', 'JUL_DEC_2025', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Health Officer', '0788200101', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-08-05 09:05:00'),
    ('b8000001-0001-4001-8001-000000000002', default_collector, 'b8000001-0001-4001-8001-000000000102', TIMESTAMP '2025-09-12 10:30:00', 'JUL_DEC_2025', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Planner', '0788200102', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-09-12 10:35:00'),
    ('b8000001-0001-4001-8001-000000000003', default_collector, 'b8000001-0001-4001-8001-000000000103', TIMESTAMP '2025-10-18 14:00:00', 'JUL_DEC_2025', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Chief Administrative Officer', '0788200103', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-10-18 14:05:00'),
    ('b8000001-0001-4001-8001-000000000004', default_collector, 'b8000001-0001-4001-8001-000000000104', TIMESTAMP '2025-11-22 11:00:00', 'JUL_DEC_2025', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'District Education Officer', '0788200104', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-11-22 11:05:00'),
    ('b8000001-0001-4001-8001-000000000005', default_collector, 'b8000001-0001-4001-8001-000000000105', TIMESTAMP '2025-08-20 08:45:00', 'JUL_DEC_2025', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Works Engineer', '0788200105', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-08-20 08:50:00'),
    ('b8000001-0001-4001-8001-000000000006', default_collector, 'b8000001-0001-4001-8001-000000000106', TIMESTAMP '2025-10-30 16:15:00', 'JUL_DEC_2025', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'District Production Officer', '0788200106', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2025-10-30 16:20:00'),
    ('b8000001-0001-4001-8001-000000000007', default_collector, 'b8000001-0001-4001-8001-000000000107', TIMESTAMP '2026-01-15 09:30:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Health Officer', '0788200107', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-01-15 09:35:00'),
    ('b8000001-0001-4001-8001-000000000008', default_collector, 'b8000001-0001-4001-8001-000000000108', TIMESTAMP '2026-02-20 13:00:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'District Water Officer', '0788200108', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-02-20 13:05:00'),
    ('b8000001-0001-4001-8001-000000000009', default_collector, 'b8000001-0001-4001-8001-000000000109', TIMESTAMP '2026-03-10 10:00:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Finance Officer', '0788200109', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-03-10 10:05:00'),
    ('b8000001-0001-4001-8001-000000000010', default_collector, 'b8000001-0001-4001-8001-000000000110', TIMESTAMP '2026-04-22 15:30:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'District Planner', '0788200110', 'FEMALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-04-22 15:35:00'),
    ('b8000001-0001-4001-8001-000000000011', default_collector, 'b8000001-0001-4001-8001-000000000111', TIMESTAMP '2026-05-08 08:00:00', 'JAN_JUN_2026', 'SYNCED', kampala_district, kampala_subcounty, kampala_parish, kampala_village, 'District Agriculture Officer', '0788200111', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-05-08 08:05:00'),
    ('b8000001-0001-4001-8001-000000000012', default_collector, 'b8000001-0001-4001-8001-000000000112', TIMESTAMP '2026-06-12 11:45:00', 'JAN_JUN_2026', 'SYNCED', ntungamo_district, ntungamo_subcounty, ntungamo_parish, ntungamo_village, 'Resident District Commissioner', '0788200112', 'MALE', 'AGE_30_AND_ABOVE', 'LGO_BUDGET_ALLOCATION', TIMESTAMP '2026-06-12 11:50:00');

    INSERT INTO lgo_budget_allocation_submissions (id) VALUES
    ('b8000001-0001-4001-8001-000000000001'),
    ('b8000001-0001-4001-8001-000000000002'),
    ('b8000001-0001-4001-8001-000000000003'),
    ('b8000001-0001-4001-8001-000000000004'),
    ('b8000001-0001-4001-8001-000000000005'),
    ('b8000001-0001-4001-8001-000000000006'),
    ('b8000001-0001-4001-8001-000000000007'),
    ('b8000001-0001-4001-8001-000000000008'),
    ('b8000001-0001-4001-8001-000000000009'),
    ('b8000001-0001-4001-8001-000000000010'),
    ('b8000001-0001-4001-8001-000000000011'),
    ('b8000001-0001-4001-8001-000000000012');

    INSERT INTO lgo_budget_allocations (
        lba_id, submission_id, previous_fy_allocations, rationale, recommendations, submitted_at
    ) VALUES
    ('b8000a01-0001-4001-8001-000000000001', 'b8000001-0001-4001-8001-000000000001',
        '{"health":{"amount":1200000000,"percentage":32},"education":{"amount":900000000,"percentage":24}}'::jsonb,
        'Health and education absorbed the largest share to address facility gaps and teacher shortages.',
        'Increase agriculture extension and water infrastructure in the next budget cycle.',
        TIMESTAMPTZ '2025-08-05 09:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000002', 'b8000001-0001-4001-8001-000000000002',
        '{"works":{"amount":650000000,"percentage":28},"water":{"amount":480000000,"percentage":21},"administration":{"amount":350000000,"percentage":15}}'::jsonb,
        'Capital works and water projects dominated spending to improve urban infrastructure.',
        'Ring-fence maintenance budgets for completed road and drainage projects.',
        TIMESTAMPTZ '2025-09-12 10:35:00+00'),
    ('b8000a01-0001-4001-8001-000000000003', 'b8000001-0001-4001-8001-000000000003',
        '{"agriculture":{"amount":420000000,"percentage":30},"health":{"amount":380000000,"percentage":27}}'::jsonb,
        'Agriculture and primary health received priority to support rural livelihoods.',
        'Expand irrigation schemes and community health outreaches.',
        TIMESTAMPTZ '2025-10-18 14:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000004', 'b8000001-0001-4001-8001-000000000004',
        '{"education":{"amount":550000000,"percentage":35},"administration":{"amount":280000000,"percentage":18}}'::jsonb,
        'Education infrastructure and staffing consumed most of the district envelope.',
        'Prioritise secondary school expansion and teacher housing in underserved sub-counties.',
        TIMESTAMPTZ '2025-11-22 11:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000005', 'b8000001-0001-4001-8001-000000000005',
        '{"health":{"amount":800000000,"percentage":26},"works":{"amount":720000000,"percentage":23},"water":{"amount":510000000,"percentage":17}}'::jsonb,
        'Health facilities, roads, and water supply were the top three expenditure lines.',
        'Improve coordination between works and water departments on shared projects.',
        TIMESTAMPTZ '2025-08-20 08:50:00+00'),
    ('b8000a01-0001-4001-8001-000000000006', 'b8000001-0001-4001-8001-000000000006',
        '{"agriculture":{"amount":360000000,"percentage":33},"education":{"amount":290000000,"percentage":27},"other":{"amount":150000000,"percentage":14}}'::jsonb,
        'Production and education programmes drove rural development spending.',
        'Increase funding for farmer cooperatives and vocational training centres.',
        TIMESTAMPTZ '2025-10-30 16:20:00+00'),
    ('b8000a01-0001-4001-8001-000000000007', 'b8000001-0001-4001-8001-000000000007',
        '{"health":{"amount":1100000000,"percentage":30},"agriculture":{"amount":450000000,"percentage":12}}'::jsonb,
        'Health services remained the largest allocation amid post-rainy season disease outbreaks.',
        'Boost surveillance and agricultural input subsidies ahead of the planting season.',
        TIMESTAMPTZ '2026-01-15 09:35:00+00'),
    ('b8000a01-0001-4001-8001-000000000008', 'b8000001-0001-4001-8001-000000000008',
        '{"water":{"amount":520000000,"percentage":29},"works":{"amount":410000000,"percentage":23}}'::jsonb,
        'Rural water and feeder roads accounted for most capital development funds.',
        'Accelerate borehole rehabilitation and link roads to market centres.',
        TIMESTAMPTZ '2026-02-20 13:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000009', 'b8000001-0001-4001-8001-000000000009',
        '{"education":{"amount":980000000,"percentage":31},"administration":{"amount":420000000,"percentage":13},"other":{"amount":180000000,"percentage":6}}'::jsonb,
        'Education and administrative overheads shaped the first-half 2026 budget.',
        'Review non-wage recurrent costs and redirect savings to classroom construction.',
        TIMESTAMPTZ '2026-03-10 10:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000010', 'b8000001-0001-4001-8001-000000000010',
        '{"health":{"amount":470000000,"percentage":25},"education":{"amount":390000000,"percentage":21},"agriculture":{"amount":310000000,"percentage":17}}'::jsonb,
        'Balanced allocations across health, education, and agriculture reflected multi-sector priorities.',
        'Establish a joint monitoring framework for cross-cutting programmes.',
        TIMESTAMPTZ '2026-04-22 15:35:00+00'),
    ('b8000a01-0001-4001-8001-000000000011', 'b8000001-0001-4001-8001-000000000011',
        '{"agriculture":{"amount":680000000,"percentage":34},"health":{"amount":520000000,"percentage":26}}'::jsonb,
        'Urban agriculture initiatives and clinic upgrades were prioritised in Kampala.',
        'Scale urban farming pilots and equip health centre IIIs with essential medicines.',
        TIMESTAMPTZ '2026-05-08 08:05:00+00'),
    ('b8000a01-0001-4001-8001-000000000012', 'b8000001-0001-4001-8001-000000000012',
        '{"works":{"amount":440000000,"percentage":22},"water":{"amount":380000000,"percentage":19},"education":{"amount":350000000,"percentage":18},"administration":{"amount":220000000,"percentage":11}}'::jsonb,
        'Infrastructure and education shared the district development budget evenly.',
        'Complete stalled classroom blocks and extend piped water to highland parishes.',
        TIMESTAMPTZ '2026-06-12 11:50:00+00');
END $$;
