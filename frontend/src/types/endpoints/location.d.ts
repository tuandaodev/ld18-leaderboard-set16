export interface Ward {
    name: string;
    mergedFrom?: string[];
}

export interface ProvinceDistrict {
    id: string;
    province: string;
    wards: Ward[];
}

export interface ProvinceDistrictResponse {
    success: boolean;
    data: ProvinceDistrict[];
}