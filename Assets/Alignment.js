#pragma strict

import System.Collections.Generic;

public class Alignment extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		var averageDir : Vector3 = Vector3.zero;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			var neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
			var num : int = 0;
			var thereAreNeighbors : boolean = false;
			
			for(var neighbor : GameObject in neighbors){
				if(neighbor.transform.parent.gameObject != null)
					neighbor = neighbor.transform.parent.gameObject;
				if(neighbor.name != this.name){
					var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
					var angle : float = Vector3.Angle(transform.forward, vecDist);
					var topAngle : float = GetComponent.<Neighborhood>().getAngle();
					
					if(vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
						velDeseada += neighbor.transform.forward;
						num++;
						thereAreNeighbors = true;
					}
				}
			}
			
			if(thereAreNeighbors){
				velDeseada /= num;
				direcDeGuiado = velDeseada - velocidad;
				var direcDeGuiadoMag : float = direcDeGuiado.magnitude;
				direcDeGuiado = Vector3.Normalize(direcDeGuiado)*(1/direcDeGuiadoMag);
			}
		}
		
		return direcDeGuiado;
	}
}