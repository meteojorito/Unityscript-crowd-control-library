#pragma strict

protected var velocidad : Vector3;
protected var approximateUp : Vector3;
public var masa : float;
public var fuerzaMax : float;
public var velMax : float;
protected var direcDeGuiado : Vector3;
protected var posObj : Vector3;
protected var velDeseada : Vector3;

protected var steerings : Component[];

protected var colors = [Color.blue, Color.green, Color.red, Color.yellow, Color.black, Color.white];

function Start () {
	velocidad = Vector3.zero;
	getBehaviours();
}

function Update () {
	direcDeGuiado = controlSteering();
	//if(direcDeGuiado == Vector3.zero) Debug.Log("direcDeGuiado es cero");
	controlVelocidad();
	controlOrientacion();
}

function controlOrientacion(){
	var newForward : Vector3;
	var newSide : Vector3;
	var newUp : Vector3;
	//Debug.DrawRay(transform.localPosition, velocidad*10, Color.blue, 500);
	newForward = Vector3.Normalize(velocidad);
	approximateUp = Vector3.Normalize(transform.up);
	newSide = Vector3.Cross(approximateUp, newForward);
	//Debug.DrawRay(transform.localPosition, new_side*10, Color.red, 500);
	newUp = Vector3.Cross(newForward, newSide);
	//Debug.DrawRay(transform.localPosition, new_up*10, Color.yellow, 500);
	transform.up = newUp;
	transform.forward = newForward;
}

function controlVelocidad(){
	var fuerzaDeGuiado = Vector3.ClampMagnitude(direcDeGuiado, fuerzaMax);
	var aceleracion = fuerzaDeGuiado / masa;
	velocidad = Vector3.ClampMagnitude(velocidad + aceleracion, velMax);
	transform.localPosition = transform.localPosition + velocidad;
}

function getBehaviours(){
	steerings = GetComponents(Steering);
}

function controlSteering() : Vector3{
	var steering : Vector3 = Vector3.zero;
	var neighborSteering : Vector3 = Vector3.zero;
	var neighborhoodWeight : float;
	var i : int = 0;
	
	for(var steer : Steering in steerings){
		var steeringVector = steer.steeringVector(velocidad, velMax);
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
	return velocidad;
}