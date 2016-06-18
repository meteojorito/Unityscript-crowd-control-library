#pragma strict

public class Steering extends MonoBehaviour{
	public var activateSteering : boolean = true;
	@Range(0.0,0.9)
	public var steeringWeight : float;
	
	function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{}
}