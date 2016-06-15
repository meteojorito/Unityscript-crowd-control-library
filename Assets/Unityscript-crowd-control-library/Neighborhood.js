#pragma strict

public class Neighborhood extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public var radii : float = 2;
	public var angle : float = 165;
	public var nTag = "neighbor";
	public var yConstraint : boolean = false;

	public function getRadii() : float{
		return radii;
	}
	
	public function getAngle() : float{
		return angle;
	}
	
	public function getTag(){
		return nTag;
	}
	
	public function getYConstraint() : boolean{
		return yConstraint;
	}
}