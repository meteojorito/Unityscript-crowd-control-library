#pragma strict

public class SteeringAttributes{
	public var activateSteering : boolean = true;
	@Range(0.0,0.9)
	public var steeringWeight : float;
}