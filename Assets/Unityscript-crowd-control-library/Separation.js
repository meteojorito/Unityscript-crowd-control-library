#pragma strict

import System.Collections.Generic;

public class Separation extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	protected var neighbors : List.<GameObject>;

	public function Start(){
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
		}
	}
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			for(var neighbor : GameObject in neighbors){
				if(neighbor.transform.parent != null)
					neighbor = neighbor.transform.parent.gameObject;
				if(neighbor.name != this.name){
					var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
					var angle : float = Vector3.Angle(transform.forward, vecDist);
					var topAngle : float = GetComponent.<Neighborhood>().getAngle();
					
					if(vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
						var vecDistMagnitude = vecDist.magnitude;
						if(vecDistMagnitude < 0.001) vecDistMagnitude = 2;
						vecDist = Vector3.Normalize(vecDist)*(1/vecDistMagnitude);
						direcDeGuiado += vecDist;
					}
				}
			}
			
			if(GetComponent.<Neighborhood>().getYConstraint()) direcDeGuiado.y = 0.0;
		}
		
		//if(this.name == "pursuer 0") Debug.Log("separation magnitude: "+direcDeGuiado.magnitude);
		
		return direcDeGuiado;
	}
}