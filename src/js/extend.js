var yjys = {
    isEmpty: function (value, allowEmptyString) {
        return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false);

    },
    isArrayEmpty: function (value) {
        return ((value === null) || (value === undefined)) || (value instanceof Array && value.length === 0);

    },
    copyTo : function (c, b) {
        if (c && b) {
            for(var a in b)
                c[a] = b[a];
        }
        return c
    },
    copyIf : function (c, b) {
        if (c && b) {
            for (var a in b) {
                if (mini.isNull(c[a])) {
                    c[a] = b[a]
                }
            }
        }
        return c
    },
    copyDeep: function (src) {
        var dst = null;
        if (src instanceof Array) {
            dst = [];
        }else if (typeof (src) == 'function') {
            dst = function () {

            };
        } else if (src instanceof Object) {
            dst = {};
        }
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                if(src[prop] instanceof Object || src[prop] instanceof Array ){
                    dst[prop] = yjys.copyDeep(src[prop]);
                }else{
                    dst[prop] = src[prop];
                }
            }
        }
        return dst;
    },
    form: {
        /**
         * 获取Form中的数据
         * @param formID_para  FormID
         * @returns {*} Form中的数据
         */
        getformdata: function (formID_para) {
            var formIns = $("#" + formID_para);
            var fieldList = formIns.find(":input");
            var tmpformfieldname = formIns.attr("field");
            var tmpresultData = {};
            var tmpformvalue = {};
            for (var i = 0; i < fieldList.length; i++) {
                var tmptag = $(fieldList[i]);
                var tmpvalue = "";
                var tmpfieldname = "";
                var tmptype = tmptag[0].type;
                tmpfieldname = tmptag.attr("field");
                if (tmpfieldname == null || tmpfieldname == undefined || tmpfieldname == "") {
                    continue;
                }
                if (tmptype == "checkbox") {
                    tmpvalue = tmptag[0].checked;
                } else {
                    tmpvalue = tmptag.val();
                }
                tmpformvalue[tmpfieldname] = tmpvalue;
            }
            console.log(tmpformvalue);
            if (!yjys.isEmpty(tmpformvalue)) {
                if (!yjys.isEmpty(tmpformfieldname)) {
                    tmpresultData[tmpformfieldname] = tmpformvalue;
                    return tmpresultData;
                } else {
                    return tmpformvalue;
                }
            }
            return  null;
        },
        getformAction : function (formID_para){
            var formIns = $("#" + formID_para);
            return formIns.attr("action");            
        },
        /**
         * 设置Form的数据
         * @param FormId_para FormID
         * @param FormData_para 待设置的Form数据
         */
        setFormData : function(FormId_para,FormData_para){
            var formIns = $("#" + FormId_para);
            var fieldList = formIns.find(":input");
            var tmpformfieldname = formIns.attr("field");
            var tmpData = yjys.isEmpty(tmpformfieldname) ? FormData_para : FormData_para[tmpformfieldname];
            for (var i = 0; i < fieldList.length; i++) {
                var tmptag = $(fieldList[i]);
                var tmpfieldname = "";
                var tmptype = tmptag[0].type;
                tmpfieldname = tmptag.attr("field");
                if (yjys.isEmpty(tmpfieldname)|| yjys.isEmpty(tmpData[tmpfieldname])) {
                    continue;
                }
                if (tmptype == "checkbox") {
                    tmptag[0].checked = tmpData[tmpfieldname];
                } else {
                    tmptag.val(tmpData[tmpfieldname]);
                }
            }
        },
    },
    request: {
        /**
         * Ajax请求
         * @param url_para Url地址
         * @param data_para 提交的数据
         * @param options_para Ajax其他扩展信息
         * @param showloading_para 异步请求时显示Loading的遮罩层
         * @param maskDomObject_para Loading的遮罩层上展示的信息
         * @param successCallback_para 请求成功回调函数
         * @param errorCallBack_para 请求失败回调函数
         * @returns {*} 服务器端返回的信息，Json格式
         */
        requestAjax: function (url_para, data_para, options_para, showloading_para, maskDomObject_para, successCallback_para, errorCallBack_para) {
            if (yjys.isEmpty(url_para)) {
                return null;
            }
            //请求标示 true:异步请求  , false 同步请求  默认：同步请求
            var tmpasync = false;
            var tmpType = 'POST';
            if (!yjys.isEmpty(options_para) && !yjys.isEmpty(options_para.async) && typeof options_para.async == "boolean") {
                tmpasync = options_para.async;
            }
            if (!yjys.isEmpty(options_para) && !yjys.isEmpty(options_para.type) && typeof options_para.type == "string") {
                tmpType = options_para.type.toUpperCase();
            }
            //返回值
            var tmpresult = null;
            //默认请求数据为空对象
            var tmpdata = {};
            //默认请求成功回调函数
            var tmpSuccessCallBack = function (text_para) {

            };
            //默认请求失败回调函数
            var tmpErrorCallBack = function (text_para) {
                //console.log("tmpErrorCallBack");
                //console.log(text_para);
            };
            //默认请求完成回调函数
            var tmpCompleteCallBack = function (text_para) {
                //console.log("tmpCompleteCallBack");
            };
            // 默认不显示
            var tmpshowloading = false;
            if (!yjys.isEmpty(showloading_para) && typeof showloading_para == "boolean") {
                tmpshowloading = showloading_para;
                if(showloading_para){
                    tmpasync = true;
                }
            }
            if (!yjys.isEmpty(options_para)) {
                if (!yjys.isEmpty(options_para.success) && typeof options_para.success == "function") {
                    tmpSuccessCallBack = options_para.success;
                }
                if (!yjys.isEmpty(options_para.error) && typeof options_para.error == "function") {
                    tmpErrorCallBack = options_para.error;
                }
                if (!yjys.isEmpty(options_para.complete) && typeof options_para.complete == "function") {
                    tmpCompleteCallBack = options_para.complete;
                }
                if (!yjys.isEmpty(options_para.data)) {
                    tmpdata = options_para.data;
                }
            }
            if (!yjys.isEmpty(successCallback_para) && typeof successCallback_para == "function") {
                tmpSuccessCallBack = successCallback_para;
            }
            if (!yjys.isEmpty(errorCallBack_para) && typeof errorCallBack_para == "function") {
                tmpErrorCallBack = errorCallBack_para;
            }
            if (!yjys.isEmpty(data_para)) {
                tmpdata = data_para;
                //若参数传进来是对象实例，则转换成字符串格式
                if (typeof tmpdata != "string") {
                    tmpdata = yjys.JSON.encode(tmpdata);
                }
            }
            var tmpMaskDom = window.body;
            if (!yjys.isEmpty(maskDomObject_para)) {
                tmpMaskDom = maskDomObject_para;
            }
            var tmpReqData = {
                url: url_para,
                type: tmpType,
                data: tmpdata,
                cache: false,
                async: tmpasync,
                contentType: 'text/json',
                success: function (text) {
                    //console.log("SuccessCallBack");
                    tmpresult = text;
                    if (tmpasync) {
                        try {
                            tmpSuccessCallBack(yjys.JSON.decode(text));
                        } catch (e) {
                            console.log("页面代码错误：" + e.stack);
                        }
                    }
                    if (tmpasync && tmpshowloading) {
                        yjys.showLoading(tmpMaskDom, false);
                    }
                },
                error: function (text) {
                    //console.log(text);
                    tmpresult = text;
                    if (tmpasync) {
                        try {
                            tmpErrorCallBack(yjys.JSON.decode(text));
                        } catch (e) {
                            console.log("页面代码错误：" + e.stack);
                        }
                    }
                    if (tmpasync && tmpshowloading) {
                        yjys.showLoading(tmpMaskDom, false);
                    }
                },
                complete: function (text) {
                    //console.log("CompleteCallBack");
                    tmpresult = text;
                    try {
                        tmpCompleteCallBack(yjys.JSON.decode(text));
                    } catch (e) {
                        console.log("页面代码错误：" + e.stack);
                    }
                    if (tmpasync && tmpshowloading) {
                        yjys.showLoading(tmpMaskDom, false);
                    }
                }
            };
            if (tmpasync && tmpshowloading) {
                yjys.showLoading(tmpMaskDom, true);
            }
            $.ajax(tmpReqData);
            if (!tmpasync) {
                return yjys.JSON.decode(tmpresult.responseText);
            }
        }
    },
    Row2Col : function(headList_para,dataList_para,colConfig,visualCol,visualColNameTemplate){
        this.tmpVisualCol = this.isEmpty(visualCol) ?  {
            'visualColNameTemplate' : "customCol",
            'visualColNameNewTemplate' : "useArea",
            'visualFieldColName' : "visualCol",
            'visualValueColName' : "visualValue",
            'visualPriColNameTemplate' : "primaryIdCol",
            'visualFieldPriColName' : "primaryIdCol",
            'visualPriValueColName' : "priValue"
        } : visualCol;
        this.tmpVisualColNameTemplate = this.isEmpty(visualColNameTemplate) ? this.tmpVisualCol.visualColNameTemplate:visualColNameTemplate;
        this.headList = headList_para;
        this.dataList = dataList_para;
        this.tmpColConfig = colConfig;
        this.visualColList = null;

    },
    disTable : function (configInfo) {
        this.configInfo = yjys.copyDeep(configInfo);
    },
    guid : function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};


yjys.Row2Col.prototype = {
    propNames : {"rowList":"rowList",'headList':'headList','col':'col','visualCol':'visualCol','visualValue':'visualValue','name':'name'},

    parseData : function (headerList,dataList,headerConfig) {
        var tmpHeaderList = this.isEmpty(headerList) ? this.headList :headerList;
        var tmpDataList = this.isEmpty(dataList) ? this.dataList : dataList;
        var tmpResult={};
        var tmpVisualDataList = [];

        if(!this.isEmpty(headerConfig))
            this.tmpColConfig = headerConfig;
        for(var i=0;i<tmpDataList.length;i++){
            this.setValueToVisualCol(tmpDataList[i],this.getVisualColList(tmpDataList,this.tmpColConfig.visualColName),tmpVisualDataList);
        }

        tmpResult[this.propNames.rowList] = tmpVisualDataList;
        tmpResult[this.propNames.headList] = this.getDisHeaderList(tmpHeaderList,tmpDataList,this.tmpColConfig.visualColName);
        return tmpResult;
    },

    /**
     * 获取虚拟列数组
     */
    getVisualColList : function (dataList,colName) {
        var tmpVisualColList = [];
        var tmpCustomColIndex=1;

        for(var i =0;i<dataList.length;i++){
            if(!this.isInList(dataList[i],tmpVisualColList,colName) && !this.isInList(dataList[i],tmpVisualColList,this.tmpColConfig.primaryIdColName)){
                var tmpSampleData ={};
                tmpSampleData[this.tmpVisualCol.visualValueColName]=dataList[i][this.isEmpty(colName) ? this.tmpColConfig.visualColName:colName];
                tmpSampleData[this.tmpVisualCol.visualFieldColName]=this.tmpVisualCol.visualColNameTemplate+tmpCustomColIndex;
                tmpSampleData[this.tmpVisualCol.visualFieldPriColName]=this.tmpVisualCol.visualPriColNameTemplate+tmpCustomColIndex;
                tmpCustomColIndex++;
                tmpVisualColList.push(tmpSampleData);
            }
        }
        this.visualColList = tmpVisualColList;
        return tmpVisualColList;
    },
    getDisHeaderList : function (headerList,dataList,colName) {
        var tmpHeaderList=[];
        for(var i in headerList){
            if(this.tmpColConfig.valueColName == headerList[i][this.propNames.col] || this.tmpColConfig.visualColName == headerList[i][this.propNames.col]){
                continue;
            }
            tmpHeaderList.push(headerList[i]);
        }
        var tmpVisualHeadList = this.getVisualColList(dataList,colName);
        for(var i in tmpVisualHeadList){
            var tmpHeader = {};
            tmpHeader[this.propNames.col]=tmpVisualHeadList[i][this.propNames.visualCol];
            tmpHeader[this.propNames.name]=tmpVisualHeadList[i][this.propNames.visualValue];
            tmpHeaderList.push(tmpHeader);
        }

        return tmpHeaderList;
    },
    setValueToVisualCol : function (data,visualColList,visualDataList) {
        var tmpData={};
        var tmpHasPrimaryElement=false;
        // 1、查找数组中是否包含相关主属性的元素
        for(var i =0;i<visualDataList.length;i++){
            if(data[this.tmpColConfig.primaryColName] == visualDataList[i][this.tmpColConfig.primaryColName]){
                tmpHasPrimaryElement = true;
                tmpData = visualDataList[i];
                break;
            }
        }

        // 2、不存在则新建元素
        if(!tmpHasPrimaryElement){
            for(var i in data){
                if(i != this.tmpColConfig.visualColName && i != this.tmpColConfig.valueColName){
                    tmpData[i] = data[i];
                }
            }
            visualDataList.push(tmpData);
        }
        // 3、增加虚拟属性和值
        for(var i =0;i<visualColList.length;i++){
            if(visualColList[i][this.tmpVisualCol.visualValueColName] == data[this.tmpColConfig.visualColName]){
                tmpData[visualColList[i][this.tmpVisualCol.visualFieldColName]] = data[this.tmpColConfig.valueColName];
                tmpData[visualColList[i][this.tmpVisualCol.visualFieldPriColName]] = data[this.tmpColConfig.primaryIdColName];
            }
        }
    },
    getVisualColNameFromVisualData : function (visualData,visualColList,colConfig) {
        for(var i=0;i<visualColList.length;i++){
            if(visualColList[i][colConfig.visualColName] == visualData){
                return;
            }
        }
    },

    /**
     * 判断是否在数组中
     * @param data
     * @param dataList
     * @returns {boolean}
     */
    isInList : function (data,dataList,colName) {
        for(var i =0;i<dataList.length;i++){
            if(data[this.isEmpty(colName) ? this.tmpColConfig.visualColName:colName] == dataList[i][this.tmpVisualCol.visualValueColName]){
                return true;
            }
        }
        return false;
    },

    updateData : function (dataList,newData,priData) {
        if(this.isEmpty(dataList) || this.isEmpty(newData) || this.isEmpty(priData)){
            return;
        }
        for(var i in dataList){
            var tmp = dataList[i];
            if(this.isEmpty(tmp[this.tmpColConfig.primaryIdColName]) || tmp[this.tmpColConfig.primaryIdColName] !=priData){
                continue;
            }else {
                tmp[this.tmpColConfig.valueColName] = newData;
                return;
            }
        }
    },
    insertData: function (visualHeadList, visualData) {
        if (!this.isEmpty(visualHeadList) && !this.isEmpty(visualData)) {
            for (var i in visualHeadList) {
                var tmp = visualHeadList[i];
                if (tmp["col"].substring(0, this.tmpVisualCol.visualColNameNewTemplate.length) == this.tmpVisualCol.visualColNameNewTemplate) {
                    var tmpNewData = {};
                    for(var j in this.headList){
                        var tmpHeadInfo = this.headList[j];
                        if(tmpHeadInfo["col"].substring(0, this.tmpVisualCol.visualColNameNewTemplate.length) == this.tmpVisualCol.visualColNameNewTemplate){
                            continue;
                        }
                        tmpNewData[tmpHeadInfo["col"]] = visualData[tmpHeadInfo["col"]];
                    }
                    //yjys.copyTo(tmpNewData, visualData);
                    tmpNewData[this.tmpColConfig.primaryIdColName] = null;
                    tmpNewData[this.tmpColConfig.visualColName] = tmp["name"];
                    tmpNewData[this.tmpColConfig.valueColName] = visualData[tmp["col"]];
                    this.dataList.push(tmpNewData);
                }
            }
        }
    },

    /**
     * 获取原始脏数据
     * @param visualDataList 脏数据
     */
    getDirtyRawDataList : function (visualDataList,visualHeadList) {
        if(this.isEmpty(visualDataList)){
            return [];
        }
        for(var i in this.visualColList){
            var tmpColInfo = this.visualColList[i];
            var tmpVisualDataCol = tmpColInfo[this.tmpVisualCol.visualFieldColName];
            var tmpVisualPriCol = tmpColInfo[this.tmpVisualCol.visualFieldPriColName];
            for(var j in visualDataList){
                var tmpData = visualDataList[j];
                var tmpVisualData = tmpData[tmpVisualDataCol];
                var tmpVisualPriData = tmpData[tmpVisualPriCol];
                this.updateData(this.dataList,tmpVisualData,tmpVisualPriData);
            }
        }
        for(var i in visualDataList){
            var tmpData = visualDataList[i];
            this.insertData(visualHeadList,tmpData);
        }

        return this.dataList;
    },
    isEmpty: function (value, allowEmptyString) {
        return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || ($.isArray(value) && value.length === 0);

    }



};


yjys.disTable.prototype = {
    /**
     * 获取列配置信息列表
     * @param columnList 原始列配置信息列表
     * @param dynamicCols 动态列配置信息列表
     * @returns {Array} 合并后列配置信息列表
     */
    getColumnObjList:function () {
        var columnList = this.configInfo.defaultHeadInfo;
        var dynamicCols = this.configInfo.visualHeadInfo.visualHeads;
        var tmpColumnObjList=[];
        for(var i in columnList){
            var tmp = columnList[i];//"data":tmp.colId,
            tmpColumnObjList.push({"data":tmp.colId,"renderer":this.headRenderer});
        }
        if(dynamicCols.length == 3){
            for(var i in dynamicCols[2]){
                var tmp = dynamicCols[2][i];
                tmpColumnObjList.push({"data":tmp,"renderer":this.headRenderer});
            }
        }
        if(dynamicCols.length == 2){
            for(var i in dynamicCols[1]){
                var tmp = dynamicCols[1][i];
                tmpColumnObjList.push({"data":tmp,"renderer":this.headRenderer});
            }
        }
        return tmpColumnObjList;
    },
    getVisualHeadDataList:function () {
        // 处理伪表头
        var tmpDataList = [];
        var tmpHeads = this.configInfo.visualHeadInfo.visualHeads;
        var tmpColumnList = this.configInfo.defaultHeadInfo;
        var tmpReadDataList = this.configInfo.dataList;
        for(var i in tmpHeads){
            tmpDataList.push({});
        }
        for(var i in tmpColumnList){
            var tmp = tmpColumnList[i];
            if(tmpHeads.length == 3){
                tmpDataList[1][tmp.colId]="";
            }
            tmpDataList[0][tmp.colId]=tmp.colName;
            //tmpDataList[2][tmp.colId]="";
        }
        if(tmpHeads.length == 3){
            for(var i in tmpHeads[2]){
                //tmpDataList[2][tmpHeads[2][i]]="";
                tmpDataList[1][tmpHeads[2][i]]=tmpHeads[1][i];
                tmpDataList[0][tmpHeads[2][i]]=tmpHeads[0][i];
            }
        }else{
            for(var i in tmpHeads[1]){
                //tmpDataList[1][tmpHeads[1][i]]="";
                tmpDataList[0][tmpHeads[1][i]]=tmpHeads[0][i];
            }
        }
        if(!yjys.isEmpty(this.dataList)){
            for(var i in this.dataList){
                tmpDataList.push(this.dataList[i]);
            }
        }
        return tmpDataList;
    },
    getMergeInfo:function(){
        var tmpMergeCells = [];

        var tmpVisualMergeCells = this.configInfo.visualHeadInfo.visualHeadMerges;
        var tmpHeads = this.configInfo.visualHeadInfo.visualHeads;
        var tmpColumnList = this.configInfo.defaultHeadInfo;
        if(tmpHeads.length == 3){
            for(var i in tmpColumnList){
                var tmp = tmpColumnList[i];
                tmp.col = tmp.col+tmpColumnList.length;
                tmpMergeCells.push({row: 0, col: parseInt(i), rowspan: 2, colspan: 1});
            }
        }
        for(var i in tmpVisualMergeCells){
            var tmp = tmpVisualMergeCells[i];
            if(typeof(tmp) == "function"){
                continue;
            }
            tmp.col = tmp.col+tmpColumnList.length;
            tmpMergeCells.push(tmp);
        }
        return tmpMergeCells;
    },
    getRawCalcValue:function (dataInfo) {
        var tmpHeads = this.getColumnObjList();
        var tmpScopeConfigStr = ["var tmpScopeFun = function () { "," return function (str) {return eval(str);}};"];
        for(var j in tmpHeads[tmpHeads.length-1]){
            var tmpColId = tmpHeads[tmpHeads.length-1][j];
            tmpScopeStr = tmpScopeStr + " var " + tmpColId +" = "+dataInfo[tmpColId] + "; ";
        }
        tmpScopeStr = tmpScopeStr + tmpScopeConfigStr[1];
        eval(tmpScopeStr);
        var countReportFun =  tmpScopeFun();
        var tmpCalcValue = countReportFun(this.configInfo.formula);
        return isNaN(tmpCalcValue) ? null : tmpCalcValue;
    },
    getReportData : function (tmpTableData,reportColName) {
        for(var i in tmpTableData){
            var tmp = tmpTableData[i];
            tmp[reportColName] =this.getRawCalcValue(tmp);
//            raw.setDataAtRowProp(parseInt(i+2),reportColName,tmp[reportColName]);
        }
    },
    headRenderer: function (instance, td, row, col, prop, value, cellProperties) {
        if (row < instance.getData().length -1) {
            td.style["backgroundColor"] = "#eee";
            cellProperties.readOnly = true;
        }
        td.innerText = value;
        td.className = td.className + " htCenter htMiddle ";
        return td;
    },
    getHandsonTableData: function (tableObj) {
        var tmpDatas = [];
        var columns = this.getColumnObjList();
        if (yjys.isEmpty(tableObj) || yjys.isEmpty(columns)) {
            return null;
        }
        var rows = tableObj.getData().length;
        for (var i = this.configInfo.visualHeadInfo.visualHeads.length - 1; i < rows; i++) {
            var tmpData = {};
            for (var j in columns) {
                var tmp = columns[j];
                tmpData[tmp.data] = tableObj.getDataAtRowProp(i, tmp.data);
            }
            tmpDatas.push(tmpData);
        }
        return tmpDatas;
    }

};




__js_dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', "g");
__js_dateRegEx2 = new RegExp("[\"']/Date\\(([0-9]+)\\)/[\"']", "g");
yjys.JSON = new (function () {
    var sb = [];
    var _dateFormat = null;
    var useHasOwn = !!{}

    .hasOwnProperty,
            replaceString = function (a, b) {
                var c = m[b];
                if (c) {
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            },
            doEncode = function (o, field) {
                if (o === null) {
                    sb[sb.length] = "null";
                    return;
                }
                var t = typeof o;
                if (t == "undefined") {
                    sb[sb.length] = "null";
                    return;
                } else {
                    if (o.push) {
                        sb[sb.length] = "[";
                        var b,
                                i,
                                l = o.length,
                                v;
                        for (i = 0; i < l; i += 1) {
                            v = o[i];
                            t = typeof v;
                            if (t == "undefined" || t == "function" || t == "unknown") {
                            }
                            else {
                                if (b) {
                                    sb[sb.length] = ",";
                                }
                                doEncode(v);
                                b = true;
                            }
                        }
                        sb[sb.length] = "]";
                        return;
                    } else {
                        if (o.getFullYear) {
                            if (_dateFormat) {
                                sb[sb.length] = '"';
                                if (typeof _dateFormat == "function") {
                                    sb[sb.length] = _dateFormat(o, field);
                                } else {
                                    sb[sb.length] = yjys.formatDate(o, _dateFormat);
                                }
                                sb[sb.length] = '"';
                            } else {
                                var n;
                                sb[sb.length] = '"';
                                sb[sb.length] = o.getFullYear();
                                sb[sb.length] = "-";
                                n = o.getMonth() + 1;
                                sb[sb.length] = n < 10 ? "0" + n : n;
                                sb[sb.length] = "-";
                                n = o.getDate();
                                sb[sb.length] = n < 10 ? "0" + n : n;
                                sb[sb.length] = "T";
                                n = o.getHours();
                                sb[sb.length] = n < 10 ? "0" + n : n;
                                sb[sb.length] = ":";
                                n = o.getMinutes();
                                sb[sb.length] = n < 10 ? "0" + n : n;
                                sb[sb.length] = ":";
                                n = o.getSeconds();
                                sb[sb.length] = n < 10 ? "0" + n : n;
                                sb[sb.length] = '"';
                            }
                            return;
                        } else {
                            if (t == "string") {
                                if (strReg1.test(o)) {
                                    sb[sb.length] = '"';
                                    sb[sb.length] = o.replace(strReg2, replaceString);
                                    sb[sb.length] = '"';
                                    return;
                                }
                                sb[sb.length] = '"' + o + '"';
                                return;
                            } else {
                                if (t == "number") {
                                    sb[sb.length] = o;
                                    return;
                                } else {
                                    if (t == "boolean") {
                                        sb[sb.length] = String(o);
                                        return;
                                    } else {
                                        sb[sb.length] = "{";
                                        var b,
                                                i,
                                                v;
                                        for (i in o) {
                                            if (!useHasOwn || Object.prototype.hasOwnProperty.call(o, i)) {
                                                v = o[i];
                                                t = typeof v;
                                                if (t == "undefined" || t == "function" || t == "unknown") {
                                                }
                                                else {
                                                    if (b) {
                                                        sb[sb.length] = ",";
                                                    }
                                                    doEncode(i);
                                                    sb[sb.length] = ":";
                                                    doEncode(v, i);
                                                    b = true;
                                                }
                                            }
                                        }
                                        sb[sb.length] = "}";
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            m = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            strReg1 = /["\\\x00-\x1f]/,
            strReg2 = /([\x00-\x1f\\"])/g;
    this.encode = function () {
        var ec;
        return function (o, dateFormat) {
            sb = [];
            _dateFormat = dateFormat;
            doEncode(o);
            _dateFormat = null;
            return sb.join("");
        };
    }
    ();
    this.decode = function () {
        var dateR;
        e1 = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.*\d*)?)Z*$/;
        var dateRe2 = new RegExp("^/+Date\\((-?[0-9]+).*\\)/+$", "g");
        var re = /[\"\'](\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})[\"\']/g;
        return function (json, parseDate) {
            if (json === "" || json === null || json === undefined) {
                return json;
            }
            if (typeof json == "object") {
                json = this.encode(json);
            }
            function evalParse(json) {
                if (parseDate !== false) {
                    json = json.replace(__js_dateRegEx, "$1new Date($2)");
                    json = json.replace(re, "new Date($1,$2-1,$3,$4,$5,$6)");
                    json = json.replace(__js_dateRegEx2, "new Date($1)");
                }
                return eval("(" + json + ")");
            }
            var data = null;
            if (window.JSON && window.JSON.parse) {
                var dateReviver = function (key, value) {
                    if (typeof value === "string" && parseDate !== false) {
                        dateRe1.lastIndex = 0;
                        var a = dateRe1.exec(value);
                        if (a) {
                            value = new Date(a[1], a[2] - 1, a[3], a[4], a[5], a[6]);
                            return value;
                        }
                        dateRe2.lastIndex = 0;
                        var a = dateRe2.exec(value);
                        if (a) {
                            value = new Date(parseInt(a[1]));
                            return value;
                        }
                    }
                    return value;
                };
                try {
                    var json2 = json.replace(__js_dateRegEx, '$1"/Date($2)/"');
                    data = window.JSON.parse(json2, dateReviver);
                } catch (ex) {
                    data = evalParse(json);
                }
            } else {
                data = evalParse(json);
            }
            return data;
        };
    }
    ();
})();
yjys.formatDate = function (e, r, p) {
    if (!e || !e.getFullYear || isNaN(e)) {
        return "";
    }
    var b = e.toString();
    var a = yjys.dateInfo;
    if (!a) {
        a = yjys.dateInfo;
    }
    if (typeof (a) !== "undefined") {
        var j = typeof (a.patterns[r]) !== "undefined" ? a.patterns[r] : r;
        var k = e.getFullYear();
        var i = e.getMonth();
        var l = e.getDate();
        if (r == "yyyy-MM-dd") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return k + "-" + i + "-" + l;
        }
        if (r == "MM/dd/yyyy") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return i + "/" + l + "/" + k;
        }
        b = j.replace(/yyyy/g, k);
        b = b.replace(/yy/g, (k + "").substring(2));
        var o = e.getHalfYear();
        b = b.replace(/hy/g, a.halfYearLong[o]);
        var c = e.getQuarter();
        b = b.replace(/Q/g, a.quarterLong[c]);
        b = b.replace(/q/g, a.quarterShort[c]);
        b = b.replace(/MMMM/g, a.monthsLong[i].escapeDateTimeTokens());
        b = b.replace(/MMM/g, a.monthsShort[i].escapeDateTimeTokens());
        b = b.replace(/MM/g, i + 1 < 10 ? "0" + (i + 1) : i + 1);
        b = b.replace(/(\\)?M/g, function (t, s) {
            return s ? t : i + 1;
        });
        var d = e.getDay();
        b = b.replace(/dddd/g, a.daysLong[d].escapeDateTimeTokens());
        b = b.replace(/ddd/g, a.daysShort[d].escapeDateTimeTokens());
        b = b.replace(/dd/g, l < 10 ? "0" + l : l);
        b = b.replace(/(\\)?d/g, function (t, s) {
            return s ? t : l;
        });
        var g = e.getHours();
        var n = g > 12 ? g - 12 : g;
        if (a.clockType == 12) {
            if (g > 12) {
                g -= 12;
            }
        }
        b = b.replace(/HH/g, g < 10 ? "0" + g : g);
        b = b.replace(/(\\)?H/g, function (t, s) {
            return s ? t : g;
        });
        b = b.replace(/hh/g, n < 10 ? "0" + n : n);
        b = b.replace(/(\\)?h/g, function (t, s) {
            return s ? t : n;
        });
        var f = e.getMinutes();
        b = b.replace(/mm/g, f < 10 ? "0" + f : f);
        b = b.replace(/(\\)?m/g, function (t, s) {
            return s ? t : f;
        });
        var q = e.getSeconds();
        b = b.replace(/ss/g, q < 10 ? "0" + q : q);
        b = b.replace(/(\\)?s/g, function (t, s) {
            return s ? t : q;
        });
        b = b.replace(/fff/g, e.getMilliseconds());
        b = b.replace(/tt/g, e.getHours() > 12 || e.getHours() == 0 ? a.tt.PM : a.tt.AM);
        var e = e.getDate();
        var h = "";
        if (e <= 10) {
            h = a.ten.Early;
        } else {
            if (e <= 20) {
                h = a.ten.Mid;
            } else {
                h = a.ten.Late;
            }
        }
        b = b.replace(/ten/g, h);
    }
    return b.replace(/\\/g, "");
};
yjys.dateInfo = {
    monthsLong: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    daysLong: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六"],
    quarterLong: ["一季度", "二季度", "三季度", "四季度"],
    quarterShort: ["Q1", "Q2", "Q2", "Q4"],
    halfYearLong: ["上半年", "下半年"],
    patterns: {
        d: "yyyy-M-d",
        D: "yyyy年M月d日",
        f: "yyyy年M月d日 H:mm",
        F: "yyyy年M月d日 H:mm:ss",
        g: "yyyy-M-d H:mm",
        G: "yyyy-M-d H:mm:ss",
        m: "MMMd日",
        o: "yyyy-MM-ddTHH:mm:ss.fff",
        s: "yyyy-MM-ddTHH:mm:ss",
        t: "H:mm",
        T: "H:mm:ss",
        U: "yyyy年M月d日 HH:mm:ss",
        y: "yyyy年MM月"
    },
    tt: {
        AM: "上午",
        PM: "下午"
    },
    ten: {
        Early: "上旬",
        Mid: "中旬",
        Late: "下旬"
    },
    today: "今天",
    clockType: 24
};

yjys.regClass = function (a, b) {
    b = b.toLowerCase();
    if (!yjys.classes[b]) {
        yjys.classes[b] = a;
        a.prototype.type = b;
    }
    var c = a.prototype.uiCls;
    if (!yjys.isNull(c) && !yjys.uiClasses[c]) {
        yjys.uiClasses[c] = a;
    }
};
yjys.extend = function (e, b, f) {
    if (typeof b != "function") {
        return this;
    }
    var g = e,
    d = g.prototype,
    a = b.prototype;
    if (g.superclass == a) {
        return;
    }
    g.superclass = a;
    g.superclass.constructor = b;
    for (var c in a) {
        d[c] = a[c];
    }
    if (f) {
        for (var c in f) {
            d[c] = f[c];
        }
    }
    return g;
};

/**
 * 打包提交到服务器的数据
 * @param servicesName_para 后台服务名称
 * @param submitData_para 提交的数据(支持Json格式的字符串或对象)
 * @returns {*} 服务器的数据
 */
yjys.packetSubmitData = function (servicesName_para,submitData_para){
    if(yjys.isEmpty(servicesName_para) || yjys.isEmpty(submitData_para)){
        return null;
    }
    return {serversName:servicesName_para,submitData:yjys.JSON.encode(submitData_para)};
};

/**
 * 关闭弹出窗口
 */
yjys.closeWindow = function(){
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow('close');
    else
        window.close();

};
yjys._doOpen = function (c) {
    if (typeof c == "string") {
        c = {
            url : c
        }
    }
    c = yjys.copyTo({
        width : 700,
        height : 400,
        allowResize : true,
        allowModal : true,
        closeAction : "destroy",
        title : "",
        titleIcon : "",
        iconCls : "",
        iconStyle : "",
        bodyStyle : "padding: 0",
        url : "",
        showCloseButton : true,
        showFooter : false
    }, c);
    c.closeAction = "destroy";
    var i = c.onload;
    delete c.onload;
    var g = c.ondestroy;
    delete c.ondestroy;
    var b = c.url;
    delete c.url;
    var e = mini.getViewportBox();
    if (c.width && String(c.width).indexOf("%") != -1) {
        var a =
            parseInt(c.width);
        c.width = parseInt(e.width * (a / 100))
    }
    if (c.height && String(c.height).indexOf("%") != -1) {
        var d = parseInt(c.height);
        c.height = parseInt(e.height * (d / 100))
    }
    var f = new mini.Window();
    f.set(c);
    f.load(b, i, g);
    f.show();
    return f
};


yjys.open = function (b) {
    if (!b) {
        return
    }
    var a = b.url;
    if (!a) {
        a = ""
    }
    var f = a.split("#");
    var a = f[0];
    if (a && a.indexOf("_winid") == -1) {
        var c = "_winid=" + mini._WindowID;
        if (a.indexOf("?") == -1) {
            a += "?" + c
        } else {
            a += "&" + c
        }
        if (f[1]) {
            a = a + "#" + f[1]
        }
    }
    b.url = a;
    b.Owner = window;
    var g = [];
    function d(i) {
        try {
            if (i.mini) {
                g.push(i)
            }
            if (i.parent && i.parent != i) {
                d(i.parent)
            }
        } catch (h) {}

    }
    d(window);
    var e = g[g.length - 1];
    return e.mini._doOpen(b)
};
yjys.GetQueryString = function (name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};


yjys.Array={};
yjys.Array.removeByValue = function(val,ArrayObj) {
    for(var i=0; i<ArrayObj.length; i++) {
        if(ArrayObj[i] == val) {
            ArrayObj.splice(i, 1);
            break;
        }
    }
};