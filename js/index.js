//获取年份下拉框
//获取月份下拉框
var api = "http://e2.shengxunwei.com/Api/";
function ajaxCommon(url,data,callback){
    $.ajax({
        type: "POST",
        url: url,
        data:data,
        dataType: "json",
        success: function(data){
        if (data.Message === null) {
            console.log(data.Message);
            return;    
        }else{
            if(data.Data!==null){
                callback();
            }
        }}
    })
}
//年月下拉框
function selectData(yearClass, monthClass) {
    var yearNumber = new Date().getFullYear();
    var monthNumber = new Date().getMonth();
    ajaxCommon(api + "WeeklyReport/GetYearList",function (data) {
        $("." + yearClass).append(setOptionTemp(data.Data));
    })
    var monthArray =[];
    for(var i = 1;i<=monthNumber+1;i++){
        monthArray.push(i);
    }
    $("." + monthClass).append(setOptionTemp(monthArray)); 
    $("." + yearClass).val(yearNumber);
    $("." + monthClass).val(monthNumber + 1);
}
//获取周
function getWeekListOfMonth(weekClass){
    var year = $("#selectYear").val();
    var month = $("#selectMonth").val();
    ajaxCommon(api + "WeeklyReport/GetWeekListOfMonth?year="+year+"&month="+month,function (data) {
        var optionTemp ="";
        var dataArray = data.Data;
        var currentWeek;
        $.each(dataArray,function(index,value){
            optionTemp +="<option value='"+dataArray[index].WeekOfYear+"'>"+intervalData(dataArray[index].Monday)+"-"+intervalData(dataArray[index].Sunday)+"</option>";
            if(dataArray[index].CurrentWeek==true){
                currentWeek = dataArray[index].WeekOfYear;
            }
        })
        $("." + weekClass).append(setOptionTemp(dataArray));
        $("." + weekClass).val(currentWeek);
    })
}
//获取项目名称
var _projectTaskList=[];//根据项目ID对应的子项目集合
function getProjectList(){
    ajaxCommon(api + "Project/GetAllProjectList",function(data){
        var projectList = data.Data.ProjectList;
        var projectTaskList = data.Data.ProjectTaskList;
        var optionTemp = "";
        $.each(projectList,function(index,value){
            optionTemp +="<option value='"+projectList[index].Id+"'>"+projectList[index].Name+"</option>";
            $.each(projectTaskList,function(item){
                var projectId = projectList[index].Id;
                if(projectId ===projectTaskList[item].ProjectId ){
                    _projectTaskList.push({projectId:projectTaskList[item]});
                }
            })
        })
        $("#projectList").append(optionTemp);
    })
}
//项目变化时,子项目跟着改变
$("#projectList").change(function(){
    var id = $(this).val();
    var optionTemp = "";
    $.each(_projectTaskList,function(index,value){
        if(_projectTaskList[index].projectId === id){
            $.each(value,function(item){
                optionTemp +="<option value='"+value[item].Id+"'>"+value[item].Name+"</option>";
            })
        }
    })
    $("#projectTaskList").append(optionTemp);
})
//获取状态列表
function GetStatusList (){
    ajaxCommon(api + "WeeklyReport/GetWeeklyReportItemStatusList",function(data){
        var dataArray = data.Data;
        var optionTemp = "";
        $.each(dataArray,function(index,value){
            optionTemp +="<option value='"+dataArray[index].Id+"'>"+dataArray[index].Text+"</option>";
        })
        $("#statusList").append(optionTemp);
    })
}

// 截取m/d
function intervalData (data) { 
    var myDate = new Date(data);
    var partMonthStr='',partDayStr=""; 
    var returnDate = "";
    partMonthStr = myDate.getMonth()+1<10?"0"+(myDate.getMonth()+1):myDate.getMonth()+1;
    partDayStr =  myDate.getDate()<10?"0"+myDate.getDate():myDate.getDate();
    returnDate = partMonthStr+"/"+partDayStr;
    return(returnDate);
 }
//  select添加option
function setOptionTemp(dataArray){
    var optionTemp ="";
    $.each(dataArray,function(index,value){
        optionTemp +="<option value='"+value+"'>"+value+"</option>";
    })
    return optionTemp;
}

//clone
var __clone = (function () {
    return function (obj) { Clone.prototype = obj; return new Clone() };
    function Clone() { }
}());

//保存周报
