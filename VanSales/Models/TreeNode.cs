using System.Collections.Generic;

namespace VanSale.Models
{
    public class TreeNode
    {
      
            public int iId { get; set; }
            public string sName { get; set; }
            public string sCode { get; set; }
            public int iParentId { get; set; }
            public bool bGroup { get;set; }
        public List<TreeNode> children { get; set; }

    }
}
