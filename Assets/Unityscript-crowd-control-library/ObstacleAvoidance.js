#pragma strict

import System.Collections.Generic;

public class ObstacleAvoidance extends Steering{
	protected var myRadii : float;
	protected var threats : List.<GameObject>;
	public var obstacleTag = "obstacle";
	public var maxDistanceDetection : float;
	public var yConstraint : boolean = false;
	protected var minDistanceOfThreat : float;
	protected var vectDistOfThreat : Vector3;
	
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;

	public function Start(){
		if(activateSteering && GetComponent.<SphereCollider>() != null){
			threats = new List.<GameObject>(GameObject.FindGameObjectsWithTag(obstacleTag));
			var myMaxScale : float = Mathf.Max(Mathf.Max(transform.localScale.x, transform.localScale.y), transform.localScale.z);
			myRadii = GetComponent.<SphereCollider>().radius * myMaxScale;
		}
	}
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<SphereCollider>() != null){
			minDistanceOfThreat = maxDistanceDetection;
			var vectDistProjection : Vector3 = Vector3.zero;
			
			for(var threat : GameObject in threats){
				if(threat.transform.parent != null)
					threat = threat.transform.parent.gameObject;
				if(!isBehind(threat)){
					var dist : float = Vector3.Distance(transform.localPosition , threat.transform.localPosition);
					if(dist < maxDistanceDetection){
						var threatMaxScale = Mathf.Max(Mathf.Max(threat.transform.localScale.x, threat.transform.localScale.y), threat.transform.localScale.z);
						var threatRadii : float = threat.GetComponent.<SphereCollider>().radius * threatMaxScale;
						
						var radiiSum : float = myRadii + threatRadii;

						if(dist < radiiSum && dist < minDistanceOfThreat){
							var vectDist : Vector3 = threat.transform.localPosition - transform.localPosition;
							//Debug.DrawRay(transform.localPosition, vectDist, Color.green, 0.01);
							vectDistProjection = Vector3.ProjectOnPlane(vectDist, transform.forward);
							minDistanceOfThreat = dist;
							//Debug.Log("Entra en el cilindro");

							//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.green, 500);
							//Debug.DrawRay(transform.localPosition, vectDist, Color.blue, 500);
						}
						//else Debug.Log("No entra en el cilindro");
					}
					//else Debug.Log("Esta demasiado lejos");
				}
				//else Debug.Log("Esta detras");
			}
			
			if(vectDistProjection != Vector3.zero)
				direcDeGuiado = Vector3.Reflect(-vectDistProjection, transform.forward);
				
			if(yConstraint == true) direcDeGuiado.y = 0.0;
		}
		
		//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.red, 0.01);
		return direcDeGuiado;
	}
	
	protected function isBehind(possibleThreat : GameObject) : boolean{
		var vectDist : Vector3 = possibleThreat.transform.localPosition - transform.localPosition;
		
		var dot = Vector3.Dot(Vector3.Normalize(vectDist), Vector3.Normalize(transform.forward));
		if(dot > 0) return false;
		else return true;
	}
}