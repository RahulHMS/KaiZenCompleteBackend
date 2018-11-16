/**
 * Smart Contract(ChainCode for Health Managment System)
 * Created and Developed by Rahul M. Desai on 2018/10/13
 * Support person Risabh L. Sharma
 * email: rahdesai7@gmail.com
 * mob: +919930831907
 * NOTE: Confidential data
 **/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
) // SimpleChaincode example simple Chaincode implementation
type User struct {
}
type PatientData struct {
	UserID     string           `json:userid`
	Name       string           `json:"name"`
	DOB        string           `json:"dob"`
	BloodGroup string           `json:"bgrp"`
	Status     string           `json:"status"`
	Followups  []SessionDetails `json:"Followups"`
	Documents  []Document       `json:"documents"`
	RewardCoin int              `json:"RewardCoin"`
}
type SessionDetails struct {
	SessionID  string
	Date       string
	Disease    string
	Medication []string
	FeesPaid   string
}
type Document struct {
	UserID       string
	DocumentType string
	DocumentLink string
	UploadDate   string
}

type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)
	switch function {
	case "CreateUser":
		return t.CreateUser(stub, args)
	case "UpdateProfile":
		return t.UpdateProfile(stub, args)
	case "GetHistoryForPatient":
		return t.GetHistoryForPatient(stub, args)
	case "Range":
		return t.Range(stub, args)
	case "ValidateProfile":
		return t.ValidateProfile(stub, args)
	case "readProduct":
		return t.readProduct(stub, args)
	default:
		//error
		fmt.Println("invoke did not find func: " + function)
		return shim.Error("Received unknown function invocation")
	}
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// ============================================================
//  - create a new patient, store into chaincode state into Blockchain -
// ============================================================
func (t *SimpleChaincode) CreateUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	//   0       1       2      3
	// UserID, "Name,  "DOB"  "Bloodgroup"

	if len(args) != 4 {

		return shim.Error("Incorrect number of arguments. Expecting 4")
	}
	UserID := args[0]
	Name := args[1]
	DOB := args[2]
	BloodGroup := args[3]
	// ==== Check if product already exists ====
	UserAsBytes, err := stub.GetState(UserID)
	if err != nil {
		return shim.Error("Failed to get patient: " + err.Error())
	} else if UserAsBytes != nil {
		fmt.Println("This Patient id " + UserID + "already exists: ")
		return shim.Error("This product with the product-ID " + UserID + "already exists: ")
	}

	// ==== Create marble object and marshal to JSON ====

	Patient := &PatientData{UserID: UserID, Name: Name, DOB: DOB, BloodGroup: BloodGroup, Status: "not approved yet"}

	PatientasBytes, err := json.Marshal(Patient)
	if err != nil {
		return shim.Error(err.Error())
	}
	// === Save marble to state ===
	err = stub.PutState(UserID, PatientasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// ===============================================
// readMarble - read a Patient info through his Id from chaincode state in Blockchain
// ===============================================
func (t *SimpleChaincode) readProduct(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var id, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the marble to query")
	}

	UserID := args[0]
	valAsbytes, err := stub.GetState(UserID) //get the marble from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Marble does not exist: " + id + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

//==============================range====================================================//
func (t *SimpleChaincode) Range(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	startKey := args[0]
	endKey := args[1]

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getMarblesByRange queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

//===============            get history for a Patient          ================================//
func (t *SimpleChaincode) GetHistoryForPatient(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	marbleName := args[0]

	fmt.Printf("- start getHistoryforPatient: %s\n", marbleName)

	resultsIterator, err := stub.GetHistoryForKey(marbleName)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the patient
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForPatient returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

//===========================update profile=====================================================//
func (t *SimpleChaincode) UpdateProfile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 9 {
		fmt.Println("Invalid no of args")
		return shim.Error("Invalid no of args")
	}
	UserId := args[0]

	// ==== Check if product already exists ====
	UserAsBytes, err := stub.GetState(UserId)
	if err != nil {
		return shim.Error("Failed to get patient: " + err.Error())
	}
	Pdata := PatientData{}
	err = json.Unmarshal(UserAsBytes, &Pdata) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error("line number 283")
	}
	SessionId := args[1]
	Date := args[2]
	Disease := args[3]
	Medication := strings.Fields(args[4])
	FeesPaid := args[5]
	DocumentType := args[6]
	DocumentLink := args[7]
	UploadDate := args[8]

	Session := SessionDetails{
		SessionID:  SessionId,
		Date:       Date,
		Disease:    Disease,
		Medication: Medication,
		FeesPaid:   FeesPaid}

	Documents := Document{
		UserID:       UserId,
		DocumentLink: DocumentLink,
		DocumentType: DocumentType,
		UploadDate:   UploadDate}

	Pdata.Followups = append(Pdata.Followups, Session)
	Pdata.Documents = append(Pdata.Documents, Documents)
	PatientasBytes, err := json.Marshal(Pdata)
	if err != nil {
		return shim.Error(err.Error())
	}
	// === Save patientdata to state ===
	err = stub.PutState(UserId, PatientasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}
func (t *SimpleChaincode) ValidateProfile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		fmt.Println("Invalid no of args")
		return shim.Error("Invalid no of args")
	}
	UserID := args[0]
	Status := args[1]

	// ==== Check if id is  valid ====
	UserAsBytes, err := stub.GetState(UserID)
	if err != nil {
		return shim.Error("Failed to get patient: " + err.Error())
	} else if UserAsBytes != nil {
		fmt.Println("This Patient id " + UserID + "already exists: ")
		return shim.Error("This product with the product-ID " + UserID + "already exists: ")
	}
	Pdata := PatientData{}
	err = json.Unmarshal(UserAsBytes, &Pdata) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	Pdata.Status = Status
	PatientasBytes, err := json.Marshal(Pdata)
	if err != nil {
		return shim.Error(err.Error())
	}
	// === Save patientdata to state ===
	err = stub.PutState(UserID, PatientasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}
