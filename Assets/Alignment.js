#pragma strict

import System.Collections.Generic;

public class Alignment extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			var neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
			var num : int = 0;
			
			for(var neighbor : GameObject in neighbors){
				var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
				var angle : float = Vector3.Angle(transform.forward, vecDist);
				var topAngle : float = GetComponent.<Neighborhood>().getAngle();
				
				if(neighbor.name != this.name && vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
					direcDeGuiado += neighbor.transform.forward;
					num++;
				}
			}
			
			direcDeGuiado /= num;
		}
		
		return direcDeGuiado;
	}
}