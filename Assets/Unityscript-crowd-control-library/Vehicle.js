#pragma strict

protected var velocity : Vector3;
public var mass : float;
public var maxForce : float;
public var maxSpeed : float;
protected var steeringVector : Vector3;

protected var steerings : Component[];

function Start () {
	velocity = Vector3.zero;
	getBehaviours();
}

function Update () {
	steeringVector = controlSteering();
	velocityControl();
	orientationControl();
}

function orientationControl(){
	var newForward : Vector3;
	var newSide : Vector3;
	var approximateUp : Vector3;
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
	velocity = Vector3.ClampMagnitude(velocity + acceleration, maxSpeed);
	transform.localPosition = transform.localPosition + velocity;
}

function getBehaviours(){
	steerings = GetComponents(Steering);
}

function controlSteering() : Vector3{
	var steering : Vector3 = Vector3.zero;
	var neighborhoodWeight : float;
	
	for(var steer : Steering in steerings){
		var sv = steer.getSteeringVector(velocity, maxSpeed);
		steering += sv * steer.steeringWeight;
	}

	return steering;
}

function getVelocity() : Vector3{
	return velocity;
}