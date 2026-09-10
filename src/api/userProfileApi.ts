import { API_URL } from "./apiConfig";

export type ProfileLive={
 id:string;
 title:string|null;
 placeName:string|null;
 startedAt:string;
 endedAt:string|null;
 thumbnailUrl:string|null;
};

export type OtherUserProfile={
 user:{id:string;username:string;displayName:string|null;avatarUrl:string|null;};
 stats:{followers:number;following:number;emissions:number;};
 isFollowing:boolean;
 lives:ProfileLive[];
};

async function request<T>(url:string,token:string,options?:RequestInit):Promise<T>{
 const response=await fetch(url,{...options,headers:{...(options?.headers||{}),Authorization:`Bearer ${token}`}});
 if(!response.ok){let message="Ha ocurrido un error";try{const b=await response.json() as {error?:string};message=b.error||message;}catch{}throw new Error(message);}
 return response.json() as Promise<T>;
}
export function getUserProfile(userId:string,token:string,signal?:AbortSignal){
 return request<OtherUserProfile>(`${API_URL}/api/users/${userId}/profile`,token,{signal});
}
export function followUser(userId:string,token:string){
 return request<{isFollowing:boolean;followers:number}>(`${API_URL}/api/users/${userId}/follow`,token,{method:"POST"});
}
export function unfollowUser(userId:string,token:string){
 return request<{isFollowing:boolean;followers:number}>(`${API_URL}/api/users/${userId}/follow`,token,{method:"DELETE"});
}
