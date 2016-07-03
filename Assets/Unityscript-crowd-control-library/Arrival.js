#pragma strict

public class Arrival extends Steering{
	public var target : GameObject;
	public var slowingDistance : float;
	public var yConstraint : boolean = false;
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3 = Vector3.zero;
	
	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;
	
	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		steeringVector = Vector3.zero;
		
		if(activateSteering){
			var vecDist = target.transform.localPosition - transform.localPosition;
			var dist = vecDist.magnitude;
			var rampedSpeed = maxSpeed * (dist / slowingDistance);
			var clippedSpeed = Mathf.Min(maxSpeed, rampedSpeed);
			
			if(dist < 0.0001)
				steeringVector = Vector3.zero;
			else{
				desiredVelocity = vecDist * (clippedSpeed / dist);
				steeringVector = desiredVelocity - velocity;
			}
						
			if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
				neighborhoodControl(dist);
			}
		}

		if(yConstraint == true) steeringVector.y = 0.0;

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