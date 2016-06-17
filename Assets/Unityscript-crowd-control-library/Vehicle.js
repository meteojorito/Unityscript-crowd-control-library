#pragma strict

protected var velocity : Vector3;
protected var approximateUp : Vector3;
public var mass : float;
public var maxForce : float;
public var velMax : float;
protected var steeringVector : Vector3;
protected var posObj : Vector3;
protected var velDeseada : Vector3;

protected var steerings : Component[];

protected var colors = [Color.blue, Color.green, Color.red, Color.yellow, Color.black, Color.white];
protected var indice : int;

function Start () {
	velocity = Vector3.zero;
	getBehaviours();
	indice = 0;
}

function Update () {
	steeringVector = controlSteering();
	controlvelocity();
	orientationControl();
	indice++;
}

function orientationControl(){
	var newForward : Vector3;
	var newSide : Vector3;
	var newUp : Vector3;

	if(velocity != Vector3.zero){
		newForward = Vector3.Normalize(velocity);
		approximateUp = Vector3.Normalize(transform.up);
		newSide = Vector3.Cross(approximateUp, newForward);
		newUp = Vector3.Cross(newForward, newSide);
		transform.up = newUp;
		transform.forward = newForward;
	}
}

function velocityControl(){
	var steeringForce = Vector3.ClampMagnitude(steeringVector, maxForce);
	var acceleration = steeringForce / mass;
	velocity = Vector3.ClampMagnitude(velocity + acceleration, velMax);
	transform.localPosition = transform.localPosition + velocity;
}

function getBehaviours(){
	steerings = GetComponents(Steering);
}

function controlSteering() : Vector3{
	var steering : Vector3 = Vector3.zero;
	var neighborhoodWeight : float;
	var i : int = 0;
	
	for(var steer : Steering in steerings){
		var steeringVector = steer.steeringVector(velocity, velMax);
		steering += steeringVector * steer.steeringWeight;

		//Debug.Log(steer.steeringName+"; "+colors[i]);
		//Debug.DrawRay(transform.localPosition, steering*50, colors[i], 0.01);
	}
	
	//if(i > 0) steering /= i;
	
	//Debug.DrawRay(transform.localPosition, steering*50, Color.grey, 500);
	return steering;
	//return Vector3.zero;
}

function getVelocity() : Vector3{
	return velocity;
}