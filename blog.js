Ext.onReady(function(){


    let createXTemplate = (rows, cols) => {
        let str='';
        for(let i = 0; i < rows; i++){
            str += '<tr>'
            for(let j = 0; j < cols; j++){
                str += '<td></td>';
            }
            str += '</tr>';
        }
        return new Ext.XTemplate([
            '<table border=1 width=100%>',
               str,
            '</table>'
         ]);
    }
    let window = new Ext.Window({
        title:'insert table',
        width:180,
        height:110,
        modal:true,
        labelAlign:'center',
        layout:'vbox',
        items:[{
            id:'rows',
            xtype:'textfield',
            emptyText:'请输入行数'
        },
        {
            id:'cols',
            xtype:'textfield',
            emptyText:'请输入列数'
        }],
        buttons:[
            {
                text:'确定',
                handler:function(){            
                    let rowsCmp = Ext.getCmp('rows');
                    let colsCmp = Ext.getCmp('cols');
                
                    htmlEditor.setValue(htmlEditor.getValue()+createXTemplate(rowsCmp.getValue(),colsCmp.getValue()).html);
                    htmlEditor.fireEvent('sync',htmlEditor);
                    rowsCmp.setValue('');
                    colsCmp.setValue('');
                    window.hide();

                }
            },{
                text:'取消',
                handler:function(){
                    window.hide();
                }
            }
        ],
        listeners:{
            beforeclose: function(p){
                p.hide();
                return false;
            }
        }
    });

     var htmlEditor = new Ext.form.HtmlEditor({
        fieldLabel: '请输入你的回复',
        enableAlignments: true,
        enableColors: true,
        enableFont: true,
        enableFontSize: true,
        enableFormat: true,
        enableLinks: true,
        enableLists: true,
        enableSourceEdit: true,
        listeners:{
            sync:function(editor,html){
                if(!Ext.isEmpty(editor.el.dom.value))
                    Ext.getCmp('reply').setDisabled(false);
                else
                    Ext.getCmp('reply').setDisabled(true);
            }
        }
    });
    

    let editItem = new Ext.menu.Item({
        text:'Edit',
        menu:[{
            text:'reset',
            listeners:{
                click:function(){
                    form.getForm().reset();
                    Ext.getCmp('reply').setDisabled(true);
                }
            }
        }]
    });

    let insertItem = new Ext.menu.Item({
        text:'Insert',
            menu:[{
                text:'table',
                handler:function(){
                    window.show();
                    Ext.getCmp('reply').setDisabled(false);
                }
            }]
    });

    let menu = new Ext.menu.Menu({
        items:[editItem,insertItem]
    });

    
    let tbar = new Ext.Toolbar({
        items:[
            {
                text:'总菜单',
                menu:menu
            }
        ]
    });

    let form = new Ext.form.FormPanel({
        id:'form',
        title:'blog comment',
        tbar:tbar,
        width:800,
        height:500,
        style:'margin:60px auto;',
        items:[htmlEditor],
        buttons:[
            {
                id:'reply',
                text:'reply',
                disabled:true,
                handler:function(){
                    let progress = Ext.MessageBox.progress('答复上传中','正在上传');
          
                    let progressLenth = 0;
                    let task = {
                        run: function(){   
                            Ext.Msg.updateProgress(progressLenth,progressLenth*100+'%');
                            progressLenth = (parseFloat(progressLenth) + 0.33).toFixed(2);
                        },
                        interval:900
                    }
                    let taskRunner = new Ext.util.TaskRunner();
                    taskRunner.start(task);
                    
                    new Ext.util.DelayedTask().delay(3000,function(){
                        taskRunner.stop(task);
                        progress.hide();
                        form.getForm().reset();
                        Ext.getCmp('reply').setDisabled(true);
                        Ext.Msg.alert('提示信息','success');
                    });              
                }
            }
        ]
    });

    new Ext.Viewport({
        items:[form],
    });


    Ext.getCmp('form').el.dom.oncontextmenu = function(event){
        event.preventDefault();
        menu.showAt([event.offsetX,event.offsetY]);
    }
});