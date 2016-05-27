﻿#pragma strict

public class Wander extends Steering{
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	protected var randomPoint : Vector3;
	protected var valueAngleY : float;
	protected var valueAngleZ : float;
	
	protected var distance : float = 0;
	protected var direcChangingTime : float = 0.0;
	
	public var constraint_y : boolean = false;
	public var logicSphereRadii : float = 3.0;
	public var logicSphereDistance : float = 5.0;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			if(distance <= 1){
				if(constraint_y) valueAngleY = 0;
				else valueAngleY = Random.Range(0, 360);
				valueAngleZ = Random.Range(0, 360);
				
				randomPoint = spherePoint(valueAngleY, valueAngleZ);
				direcChangingTime = Random.Range(1.0, 3.0);
			}
			
			distance = Vector3.Distance(transform.localPosition, randomPoint);
			velDeseada = Vector3.Normalize(randomPoint - transform.localPosition)*velMax;
			direcDeGuiado = velDeseada - velocidad;
			
			//Debug.DrawRay(transform.localPosition, velocidad, Color.green, 500);
			//Debug.DrawRay(transform.localPosition, velDeseada, Color.red, 500);
			//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
		}
		
		//if(this.name == "pursuer 0") Debug.Log("wander magnitude: "+direcDeGuiado.magnitude);
		
		return direcDeGuiado;
	}
	
	private function spherePoint(angleY : float, angleZ : float) : Vector3{
		var radianZ = angleZ * Mathf.PI / 180;
		var radianY = angleY * Mathf.PI / 180;
		
		var x = logicSphereRadii * Mathf.Cos(radianY) * Mathf.Sin(radianZ) + transform.localPosition.x;
		var y = logicSphereRadii * Mathf.Sin(radianY) * Mathf.Sin(radianZ) + transform.localPosition.y;
		var z = logicSphereRadii * Mathf.Cos(radianZ) + transform.localPosition.z;
		
		return new Vector3(x, y, z + logicSphereDistance);
	}
}