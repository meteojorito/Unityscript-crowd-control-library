﻿#pragma strict

public class Arrival extends Steering{
	public var objetivo : GameObject;
	public var slowingDistance : float;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	public var neighborhoodDeactivationDistance : float = 1.0;
	protected var sepWeight : float;
	protected var cohWeight : float;
	protected var aliWeight : float;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			var vecDist = objetivo.transform.localPosition - transform.localPosition;
			var dist = vecDist.magnitude;
			var rampedSpeed = velMax * (dist / slowingDistance);
			var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
			
			velDeseada = vecDist * (clippedSpeed / dist);
			direcDeGuiado = velDeseada - velocidad;
			
			if(GetComponent.<Neighborhood>() != null){
				neighborhoodControl(dist);
			}
		}
		
		//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
		
		return direcDeGuiado;
	}
	
	protected function neighborhoodControl(dist : float){
		if(dist < neighborhoodDeactivationDistance){
			if(GetComponent.<Separation>() != null){
				sepWeight = GetComponent.<Separation>().steeringWeight;
				GetComponent.<Separation>().steeringWeight = 0.0;
			}
			if(GetComponent.<Cohesion>() != null){
				cohWeight = GetComponent.<Cohesion>().steeringWeight;
				GetComponent.<Cohesion>().steeringWeight = 0.0;
			}
		}
		else{
			if(GetComponent.<Separation>() != null && GetComponent.<Separation>().steeringWeight == 0.0)
				GetComponent.<Separation>().steeringWeight = sepWeight;
			if(GetComponent.<Cohesion>() != null && GetComponent.<Cohesion>().steeringWeight == 0.0)
				GetComponent.<Cohesion>().steeringWeight = cohWeight;
		}
	}
}