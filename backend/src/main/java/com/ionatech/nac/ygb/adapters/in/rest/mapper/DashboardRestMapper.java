package com.ionatech.nac.ygb.adapters.in.rest.mapper;

import com.ionatech.nac.ygb.adapters.in.rest.dto.*;
import com.ionatech.nac.ygb.domain.model.FormType;
import com.ionatech.nac.ygb.domain.valueobjects.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DashboardRestMapper {

    DashboardAggregatesResponseDto toResponse(DashboardAggregates aggregates);

    DistrictCountDto toDto(DistrictCount domain);

    GenderCountDto toDto(GenderCount domain);

    TimeSeriesPointDto toDto(TimeSeriesPoint domain);

    @Mapping(target = "formType", expression = "java(domain.formType().name())")
    FormTypeCountDto toDto(FormTypeCount domain);

    FinancialYearPeriodCountDto toDto(FinancialYearPeriodCount domain);

    List<DistrictCountDto> toDistrictDtoList(List<DistrictCount> domains);

    List<GenderCountDto> toGenderDtoList(List<GenderCount> domains);

    List<TimeSeriesPointDto> toTimeSeriesDtoList(List<TimeSeriesPoint> domains);

    List<FormTypeCountDto> toFormTypeDtoList(List<FormTypeCount> domains);

    List<FinancialYearPeriodCountDto> toFinancialYearPeriodDtoList(List<FinancialYearPeriodCount> domains);

    default FormType mapFormType(String value) {
        return value == null ? null : FormType.valueOf(value);
    }
}
