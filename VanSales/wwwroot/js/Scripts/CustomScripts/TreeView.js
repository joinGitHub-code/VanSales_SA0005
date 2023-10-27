var $treeView;
var rootname = $('#hdn_title').val();
function refreshTable() {
    table.destroy();
    table = initializeTable();
}

function loadTree() {
    $treeView = $('#treeViewdiv');
    $treeView.jstree('destroy');
    if ($.fn.jstree) {
        $treeView.jstree({
            'core': {
                'data': {
                    'url': '/Master/GetTreeData',
                    'data': function (node) {
                        return {
                            'sAPIName': 'GetTreeView',
                            'iParentId': node.id === '#' ? 0 : node.id,
                            'iMaster': menuId,
                            'rootnode': rootname
                        };
                    },
                },
                'check_callback': true,
                'themes': {
                    "dots": true,
                    "icons": false,
                },
            },
            'plugins': ['dnd', 'contextmenu', 'search'],
            'checkbox': {
                'keep_selected_style': false
            },

        })
    }
}
$(document).ready(function () {
    // Load the tree initially
    loadTree();
    $treeView.on('loaded.jstree', function () {
        // Check if there are no records and show a message
        if ($treeView.jstree(true).get_json('#').length === 0) {
            $treeView.html('No Records');
        }
    });
    $('#treeViewdiv').on('move_node.jstree', function (e, data) {
        // Handle the node move
        // console.log('Node moved:', data.node, 'to', data.parent);
        updateNodePosition(data.node.id, data.parent);
        $treeView.jstree('refresh');
    });


    $('#treeViewdiv').on('select_node.jstree', function (e, data) {
       // console.log(data.node);
        var clickedNode = data.node;
        parentId = clickedNode.id;
        if (clickedNode) {
            //console.log(clickedNode.id);
            var urlPath = updatePathLink(clickedNode);
            $('#treeUrl').text(urlPath);
            refreshTable();
            $('#treeViewdiv').jstree(true).open_node(clickedNode.id);

            table.ajax.reload();
            // console.log(urlPath);
        }
    });

});

$('#' + tableId + ' tbody').on('click', 'tr', function () {
    var row = $(this).closest('tr');
    const rowData = table.row(this).data();

    if (!isDoubleClick && !$(this).closest('tr').find('input[type="checkbox"]').is(':checked')) {
        // Perform single-click action only if it's not a double-click
        singleClickTimer = setTimeout(function () {
            parentId = rowData.iId;
            refreshTable();
            table.ajax.reload();
            var jstreeInstance = $('#treeViewdiv').jstree(true);
            // Select the corresponding node in the tree view
            jstreeInstance.select_node(parentId);
            // Trigger the 'select_node.jstree' event for the selected node
            jstreeInstance.trigger('select_node.jstree', { node: jstreeInstance.get_node(parentId) });
        }, doubleClickDelay);
    }
    // Reset the flag for the next click event
    isDoubleClick = false;
});



function buildURLPath(node) {
    var urlPath = [];
    var pathLinkHTML = '';
    while (node) {
        if (node.text) {
            // Create an anchor tag for each division with custom styles
            var divisionLink = '<a href="#" data-node-id="' + node.id + '" style="color: black; font-family: Arial, sans-serif;">' + node.text + '</a>';
            urlPath.push(divisionLink);
        }
        node = $('#treeViewdiv').jstree(true).get_node(node.parent);
    }
    // Reverse the array and join it to form the URL path with clickable links
    urlPath.reverse();
    pathLinkHTML = urlPath.join('/');
    return pathLinkHTML;
}

function updatePathLink(node) {
    var pathLinkHTML = buildURLPath(node);
    var pathLink = document.getElementById("pathLink");
    if (pathLink) {
        pathLink.innerHTML = pathLinkHTML;
        var divisionLinks = pathLink.querySelectorAll('a');
        divisionLinks.forEach(function (divisionLink) {
            divisionLink.addEventListener('click', function (event) {
                event.preventDefault();
                var nodeId = this.getAttribute('data-node-id');
                // Deselect all nodes before selecting the clicked node
                var treeView = $('#treeViewdiv').jstree(true);
                $('#treeViewdiv').jstree(true).deselect_all();
                treeView.close_all();
                // Select the clicked node by its ID
                $('#treeViewdiv').jstree(true).select_node(nodeId);
            });
        });
    }
}

function updateNodePosition(nodeId, newParentId) {
    $.ajax({
        url: '/Master/UpdateData',
        type: 'GET',
        data: {
            sAPIName: 'ChangeParentId',
            iParentId: newParentId,
            iId: nodeId,
            iMenuId: menuId
        },
        success: function (response) {
            response = JSON.parse(response);

            if (response.Status === "Success") {
                $treeView.jstree('refresh');
                var node = $treeView.jstree(true).get_node(nodeId);
                if (node) {
                    $treeView.jstree(true).set_state(node, true);
                }
                table.ajax.reload();
            } else {
                runError(response.MessageDescription);
            }
        }

    });
}
