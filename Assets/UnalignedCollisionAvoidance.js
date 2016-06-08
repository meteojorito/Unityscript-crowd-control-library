﻿#pragma strict

import System.Collections.Generic;

public class UnalignedCollisionAvoidance extends Steering{
	protected var velDeseada : Vector3;
	protected var threats : List.<GameObject>;
	protected var minDistanceOfThreat : float;
	public var maxDistanceDetection : float = 1.0;
	public var obstacleTag = "obstacle";
	public var yConstraint : boolean = false;
	
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<SphereCollider>() != null){
			var vecDist : Vector3 = Vector3.zero;
			var threatSpeed : float;
			threats = new List.<GameObject>(GameObject.FindGameObjectsWithTag(obstacleTag));
			var myFuturePos : Vector3 = transform.localPosition + velocidad;
			minDistanceOfThreat = maxDistanceDetection;
			
			var myMaxScale : float = Mathf.Max(Mathf.Max(transform.localScale.x, transform.localScale.y), transform.localScale.z);
			var myRadii = GetComponent.<SphereCollider>().radius * myMaxScale;
			
			for(var threat : GameObject in threats){
				if(threat.name != this.name && threat.GetComponent.<SphereCollider>() != null){
					var velThreat : Vector3 = threat.GetComponent(Vehicle).getVelocity();
					var threatFuturePos : Vector3 = threat.transform.localPosition + velThreat;
					var dist = Vector3.Distance(myFuturePos, threatFuturePos);
					
					var threatMaxScale = Mathf.Max(Mathf.Max(threat.transform.localScale.x, threat.transform.localScale.y), threat.transform.localScale.z);
					var threatRadii = threat.GetComponent.<SphereCollider>().radius * threatMaxScale;
					
					//Debug.Log("name: "+name+"; radius: "+myRadii+"; dist: "+dist);
					
					var radiiSum : float = myRadii + threatRadii;

					if(dist < radiiSum && dist < minDistanceOfThreat){
						vecDist = /*Vector3.Normalize(*/threatFuturePos - transform.localPosition/*)*/;
						
						threatSpeed = velThreat.magnitude;
						minDistanceOfThreat = dist;
						//Debug.DrawRay(transform.localPosition, vecDist, Color.green, 0.01);
					}
				}
			}
			
			if(vecDist != Vector3.zero){
				var mySpeed : float = velocidad.magnitude;
				if(mySpeed < threatSpeed){
					var distance = vecDist.magnitude;
					var slowingDistance : float = dist;
					var rampedSpeed = velMax * (distance / slowingDistance);
					var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
					velDeseada = vecDist * (clippedSpeed / distance);
				}
				else
					velDeseada = vecDist*2;
				
				if(yConstraint == true) velDeseada.y = 0.0;
				
				var vectDistProjection = Vector3.ProjectOnPlane(velDeseada, transform.forward);
				direcDeGuiado = Vector3.Reflect(-vectDistProjection, transform.forward);
				//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.red, 0.01);
			}
		}
		
		return direcDeGuiado;
	}
}