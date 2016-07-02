#pragma strict

public class Pursuit extends Steering{
	public var target : GameObject;
	public var pursuitDistance : float = 3.0;
	public var yConstraint : boolean = false;
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3 = Vector3.zero;

	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;

	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(target.transform.localPosition, transform.localPosition);

			if(dist < pursuitDistance){
				var targetVelocity = target.GetComponent.<Vehicle>().getVelocity();
				var estimPos = target.transform.localPosition + targetVelocity*dist;
				
				desiredVelocity = Vector3.Normalize(estimPos - transform.localPosition)*maxSpeed;
				steeringVector = desiredVelocity - velocity;
				
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