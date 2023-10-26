namespace VanSale.Models
{
    public class JqueryDatatableParam
    {
        public string sEcho { get; set; }
        public string sSearch { get; set; }
        public int iDisplayLength { get; set; }
        public int iDisplayStart { get; set; }
        public int iColumns { get; set; }
        public int iSortCol_0 { get; set; }
        public string sSortDir_0 { get; set; }
        public int iSortingCols { get; set; }
        public string sColumns { get; set; }
        //for product
        public string fVatPer { get; set; }
        public string fTaxper { get; set; }
        public string bBatch { get; set; }

    }

    public class AutoCompleteParameters
    {
        public int? iId { get; set; }
        public string sName { get; set; }
       
        public string sCode { get; set; }
        

    }
}
