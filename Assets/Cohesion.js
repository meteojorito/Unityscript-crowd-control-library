#pragma strict

import System.Collections.Generic;

public class Cohesion extends Steering{
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
		var averagePos : Vector3 = transform.localPosition;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			averagePos = Vector3.zero;
			var num : int = 0;
			var thereAreNeighbors : boolean = false;
			
			for(var neighbor : GameObject in neighbors){
				if(neighbor.transform.parent != null)
					neighbor = neighbor.transform.parent.gameObject;
				var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
				var angle : float = Vector3.Angle(transform.forward, vecDist);
				var topAngle : float = GetComponent.<Neighborhood>().getAngle();
				
				if(neighbor.name != this.name && vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
					averagePos += neighbor.transform.localPosition;
					num++;
					thereAreNeighbors = true;
				}
			}
			
			if(thereAreNeighbors){
				averagePos /= num;
				
				vecDist = averagePos - transform.localPosition;
				direcDeGuiado = Vector3.Normalize(vecDist)*(1/vecDist.magnitude);
			}
			
			if(GetComponent.<Neighborhood>().getYConstraint()) direcDeGuiado.y = 0.0;
		}

		//if(this.name == "pursuer 0") Debug.Log("cohesion magnitude: "+direcDeGuiado.magnitude);

		return direcDeGuiado;
	}
}