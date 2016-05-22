#pragma strict

public class Steering extends MonoBehaviour{
	public var activateSteering : boolean = true;
	@Range(1,9)
	public var steeringWeight : float;
	public var steeringName = "name";
	
	public function steeringVector(velocidad : Vector3, velMax : float) : Vector3 {}
}