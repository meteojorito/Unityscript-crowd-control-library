#pragma strict

public class Flee extends Steering{
	public var target : GameObject;
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3;

	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		steeringVector = Vector3.zero;
		if(activateSteering){
			desiredVelocity = Vector3.Normalize(target.transform.localPosition - transform.localPosition)*maxSpeed;
			steeringVector = velocity - desiredVelocity;
		}

		return steeringVector;
	}
}