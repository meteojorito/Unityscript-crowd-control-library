#pragma strict

public class Seek extends Steering{
	public var target : GameObject;
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3;

	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		if(activateSteering){
			desiredVelocity = Vector3.Normalize(target.transform.localPosition - transform.localPosition)*maxSpeed;
			steeringVector = desiredVelocity - velocity;
		}
		
		return steeringVector;
	}
}