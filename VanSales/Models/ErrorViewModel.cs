using System;

namespace VanSales.Models
{
    public class ErrorViewModel
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }

    public class ErrorResponse
    {
        public string Status { get; set; }
        public string MessageDescription { get; set; }
        public object ResultData { get; set; }
    }
    public class ApiResponse
    {
        public string Status { get; set; }
        public string MessageDescription { get; set; }
        public object ResultData { get; set; }
    }

}
