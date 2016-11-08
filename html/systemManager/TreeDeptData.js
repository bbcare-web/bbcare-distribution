var TreeDeptData = { Rows : [
        { id: '01', name: "商品菜单",   remark: "商品菜单",
            children: [
            { id: '0101', name: "商品管理", remark: "商品管理",url:"html/shop/shop.html"
            },
            { id: '0102', name: "商品类型", remark: "商品类型", children:
                [
                    {
                        id: '010201', name: "医院服务", remark: "医院服务 ", children:
                        [
                            { id: '01020101', name: "儿科服务", remark: "儿科服务" ,url:"html/shop/shop.html"},
                            { id: '01020102', name: "呼吸科服务", remark: "呼吸科服务" ,url:"html/shop/shop.html"}
                        ]
                    },
                    { id: '010202', name: "服务类型", remark: "服务类型",url:"html/shop/shop.html"}
                ]
            },
            { id: '0103', name: "订单管理", remark: "订单管理",url:"html/shop/shop.html"}
        ]
        },
        { id: '02', name: "机构管理", remark: "机构管理",url:"html/shop/shop.html"},
        { id: '03', name: "分销代理", remark: "分销代理",url:"html/shop/shop.html"}  
    ]  
};