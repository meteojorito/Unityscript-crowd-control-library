#pragma strict

import System.Collections.Generic;

public class Cohesion extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		var averagePos : Vector3 = transform.localPosition;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			var neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
			averagePos = Vector3.zero;
			var num : int = 0;
			
			for(var neighbor : GameObject in neighbors){
				var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
				var angle : float = Vector3.Angle(transform.forward, vecDist);
				var topAngle : float = GetComponent.<Neighborhood>().getAngle();
				
				if(neighbor.name != this.name && vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
					averagePos += neighbor.transform.localPosition;
					num++;
				}
			}
			
			averagePos /= num;
		}

		/*if(GetComponent.<UnalignedCollisionAvoidance>() != null && GetComponent.<UnalignedCollisionAvoidance>().getDirecDeGuiado() != Vector3.zero){
			direcDeGuiado = Vector3.zero;
			Debug.Log("Cohesion zero");
		}
		else*/ direcDeGuiado = Vector3.Normalize(averagePos - transform.localPosition);

		return direcDeGuiado;
	}
}