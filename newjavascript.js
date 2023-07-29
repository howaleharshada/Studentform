/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "Student-DB";
var studentRelationName = "Student-Data";
var connToken = "90931400|-31949321752224238|90949911";

$("#studentrollNo").focus();
        
function saveRecNo2LS(jsonObj){
    var lvData = JSON.parsel(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStudentRollNoAsJsonObj(){
    var studentrollNo = $("#studentrollNo").val();
    var jsonStr = {
        id:studentrollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data.record);
    $("#studentname").val(data.name);
    $("#studentcls").val(data.cls);
    $("#student_birthdate").val(data.birthdate);
    $("#student_address").val(data.address);
    $("#student_enrollmentDate").val(data.enrollmentDate);
}

function resetForm(){
    $("#studentrollNo").val("");
    $("#studentname").val("");
    $("#studentcls").val("");
    $("#student_birthdate").val("");
    $("#student_address").val("");
    $("#student_enrollmentDate").val("");
    $("#studentrollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#studentrollNo").focus();
}

function validateData(){
    var studentrollNo, studentname, studentcls, student_birthdate, student_address, student_enrollmentDate;
    studentrollNo = $("#studentrollNo").val();
    studentname = $("#studentname").val();
    studentcls = $("#studentcls").val();
    student_birthdate = $("#student_birthdate").val();
    student_address = $("#student_address").val();
    student_enrollmentDate = $("#student_enrollmentDate").val();
    
    if (studentrollNo === ""){
        alert("Student Roll No. Missing");
        $("#studentrollNo").focus();
        return "";
    }
    if (studentname === ""){
        alert("Student Name Missing");
        $("#studentname").focus();
        return "";
    }
    if (studentcls === ""){
        alert("Student Class Missing");
        $("#studentcls").focus();
        return "";
    }
    if (student_birthdate === ""){
        alert("Brith Date Missing");
        $("#student_birthdate").focus();
        return "";
    }
    if (student_address === ""){
        alert("Address Missing");
        $("#student_address").focus();
        return "";
    }
    if (student_enrollmentDate === ""){
        alert("Enrollment Date Missing");
        $("#student_enrollmentDate").focus();
        return "";
    }
    
    var jsonStrObj = {
        rollNo: studentrollNo,
        name: studentname,
        cls: studentcls,
        birthdate: student_birthdate,
        address: student_address,
        enrollmentDate: student_enrollmentDate
    };
    return JSON.stringify(jsonStrObj);
}

function getStudent(){
    var studentrollNoJsonObj = getStudentRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, studentrollNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status === 400){
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#studentname").focus();
        
    } else if(resJsonObj.status === 200){
        
        $("#studentrollNo").prop("disabled",true);
        fillData(resJsonObj);
        
        $("#update").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#studentname").focus();
       
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $("#studentrollNo").focus();  
}

function updateData(){
    $("#update").prop("disabled",true);
    var jsonUpd = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonUpd, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#studentrollNo").focus();    
}