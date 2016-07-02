#pragma strict

public class Evasion extends Steering{
	public var pursuer : GameObject;
	public var evasionDistance : float = 3.0;
	public var yConstraint : boolean = false;
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3 = Vector3.zero;

	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;

	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(pursuer.transform.localPosition, transform.localPosition);
			
			if(dist < evasionDistance){
				var pursuerVelocity = pursuer.GetComponent.<Vehicle>().getVelocity();
				var estimPos = pursuer.transform.localPosition + pursuerVelocity*dist;
				
				desiredVelocity = Vector3.Normalize(estimPos - transform.localPosition)*maxSpeed;
				steeringVector = velocity - desiredVelocity;
				
				if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
					neighborhoodControl(dist);
				}
			}
		}

		if(yConstraint) steeringVector.y = 0.0;

		return steeringVector;
	}
	
	protected function neighborhoodControl(dist : float){
		if(dist < neighborhoodDeactivationDistance){
			if(GetComponent.<Separation>() != null) GetComponent.<Separation>().activateSteering = false;
			if(GetComponent.<Cohesion>() != null) GetComponent.<Cohesion>().activateSteering = false;
			if(GetComponent.<Alignment>() != null) GetComponent.<Alignment>().activateSteering = false;
		}
		else{
			if(GetComponent.<Separation>() != null) GetComponent.<Separation>().activateSteering = true;
			if(GetComponent.<Cohesion>() != null) GetComponent.<Cohesion>().activateSteering = true;
			if(GetComponent.<Alignment>() != null) GetComponent.<Alignment>().activateSteering = true;
		}
	}
}