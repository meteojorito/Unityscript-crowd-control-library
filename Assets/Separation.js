﻿#pragma strict

import System.Collections.Generic;

public class Separation extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			var neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
			
			for(var neighbor : GameObject in neighbors){
				if(neighbor.name != this.name){
					var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
					var angle : float = Vector3.Angle(transform.forward, vecDist);
					var topAngle : float = GetComponent.<Neighborhood>().getAngle();
					
					if(vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
						var vecDistMagnitude = vecDist.magnitude;
						vecDist = Vector3.Normalize(vecDist)*(1/vecDistMagnitude);
						/*if(GetComponent.<UnalignedCollisionAvoidance>() != null && GetComponent.<UnalignedCollisionAvoidance>().getDirecDeGuiado() != Vector3.zero){
							direcDeGuiado = Vector3.zero;
							Debug.Log("Cohesion zero");
						}
						else*/ direcDeGuiado += vecDist;
					}
				}
			}
		}
		
		if(this.name == "vehiculo 0") Debug.Log("separation magnitude: "+direcDeGuiado.magnitude);
		
		return direcDeGuiado;
	}
}