﻿namespace Nebb.Nss._2022.Aws.Service.Helpers
{
    public class QueryStringParameters
    {
        private const int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
        }
        public string OrderBy { get; set; } = "date";
        public string SortOrder { get; set; } = "desc";
        public string? SearchBy { get; set; } = null;
        public string FilterBy { get; set; } = "allFiles";
        public bool IsDeleted { get; set; } = false;
    }
}
