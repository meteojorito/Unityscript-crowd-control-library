#pragma strict
import System.Collections.Generic;
/*var arrayShape1 : Vector3[] = [
Vector3( -0.2313123 , 1.87166 , 0 ),
Vector3( -6.037891 , 1.609666 , 0 ),
Vector3( -4.192263 , 1.268853 , 0 ),
Vector3( -2.034433 , 1.423047 , 0 ),
Vector3(1.621191 , 2.991139 , 0 ),

Vector3( 3.364995 , 4.658966 , 0 ),
Vector3( 5.65909 , 7.575665 , 0 ),
Vector3( 7.766418 , 11.54954 , 0 ),
Vector3( -7.193126 , 3.067553 , 0 ),
Vector3( -5.713888 , 3.885082 , 0 ),

Vector3( -3.796166 , 4.675553 , 0 ),
Vector3( -2.627379 , -2.627379 , 0 ),
Vector3( -3.781447 , 8.166225 , 0 ),
Vector3( -6.038039 , 6.670299 , 0 ),
Vector3( -6.099373 , 9.279655 , 0 ),

Vector3( -5.012612 , 11.38713 , 0 ),
];*/

public var shapes : GameObject[];
public var fishList : GameObject[];
protected var fishPosDic : Dictionary.<GameObject,Vector3>;
protected var shapeIndex : int = 0;
protected var currentShape : GameObject;

protected var numShapes : int;
protected var numFishPos : int;
protected var inExecution1 : boolean = false;
protected var inExecution2 : boolean = false;
protected var deleteShapeHasFinished : boolean = true;
protected var numArrived : int;

protected var haveArrived : List.<boolean>;

function Start () {
	fishPosDic = new Dictionary.<GameObject,Vector3>();
	fishList = GameObject.FindGameObjectsWithTag("neighbor");

	numShapes = shapes.Length;
	numFishPos = fishList.Length;
	numArrived = 0;

	haveArrived = new List.<boolean>();
	for(var i : int = 0 ; i < numFishPos ; i++)
		haveArrived.Add(false);
}

function Update () {
	if(!inExecution1){
		routine1();
		inExecution1 = true;
		inExecution2 = true;
	}

	Debug.Log("Esperando...");
	if(inExecution1 && inExecution2){
	Debug.Log("Ejecutando...");
		var index : int = 0;
		for(var i in fishPosDic){
			var fish = i.Key;
			var pos = i.Value;

			var distance = Vector3.Distance(fish.transform.localPosition, pos);
			//if(fish.name == "leader") Debug.Log("distance: "+distance);
			if(distance < 0.001 && !haveArrived[index]){
				numArrived++;
				haveArrived[index] = true;
				//Debug.Log("numArrived: "+numArrived);
			}

			index++;
		}
	}

	if(numArrived == numFishPos){
		//Debug.Log("Entro porque estamos todos");
		inExecution2 = false;
		numArrived = 0;
	}

	if(!inExecution2){
		inExecution2 = true;
		routine2();
	}
}

function prepareShape(){
	Debug.Log("rutina 1: "+Time.time);

	yield WaitForSeconds(5);

	currentShape = shapes[shapeIndex];
	currentShape = Instantiate(currentShape, Vector3(0, 0, 0), Quaternion.identity);

	var index : int = 0;
	for(var child : Transform in currentShape.transform){
		var fish = fishList[index];
		fish.GetComponent.<Arrival>().objetivo = child.gameObject;
		fish.GetComponent.<Flee>().objetivo = child.gameObject;
		if(fish.name == "leader"){
			fish.GetComponent.<Wander>().activateSteering = false;
		}
		else{
			fish.GetComponent.<Neighborhood>().activateSteering = false;
			fish.GetComponent.<LeaderFollowing>().activateSteering = false;
		}

		fish.GetComponent.<Arrival>().activateSteering = true;
		fishPosDic.Add(fish, child.localPosition);

		index++;
	}

	Debug.Log("rutina 1 terminada: "+Time.time);
}

function deleteShape(){
	Debug.Log("rutina 2: "+Time.time);

	if(shapeIndex == numShapes - 1) shapeIndex = 0;
	else shapeIndex++;

	for(var i in fishPosDic){
		var key = i.Key;
		key.GetComponent.<Arrival>().activateSteering = false;
		key.GetComponent.<Flee>().activateSteering = true;
		yield WaitForSeconds(0.01);
	}

	//yield WaitForSeconds(2);

	for(var i in fishPosDic){
		var fish = i.Key;

		if(fish.name == "leader"){
			fish.GetComponent.<Wander>().activateSteering = true;
		}
		else{
			//Debug.Log("entro");
			fish.GetComponent.<Neighborhood>().activateSteering = true;
			fish.GetComponent.<LeaderFollowing>().activateSteering = true;
		}

		fish.GetComponent.<Flee>().activateSteering = false;
	}

	for(var i : int = 0 ; i < numFishPos ; i++)
		haveArrived[i] = false;

	Destroy(currentShape);
	fishPosDic.Clear();

	inExecution1 = false;

	 Debug.Log("rutina 2 terminada: "+Time.time);
}

function routine1(){
	yield StartCoroutine("prepareShape");
}

function routine2(){
	yield StartCoroutine("deleteShape");
}