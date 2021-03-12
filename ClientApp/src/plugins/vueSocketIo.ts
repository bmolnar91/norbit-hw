import Vue from "vue";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import store from "../store";
import config from "@/config";
function convertEventName( eventName: string ): string {
  const nameArray = eventName.split( " " );
  if ( nameArray.length > 1 && ![ "created", "updated", "deleted", "removed", "patched" ].includes( nameArray[1] ) ) {
    eventName = nameArray[1];
  }
  else if ( nameArray.length > 1 ) {
    const pathArray = nameArray[0].split( "/" );
    const serviceName = pathArray[1] || pathArray[0];
    eventName = `${serviceName}-${nameArray[1]}`;
  }
  let newName = "";
  let shouldConvertToUppercase = false;
  for ( let i = 0; i < eventName.length; i++ ) {
    const letter = eventName[i];
    if ( i === 0 ) {
      newName = letter.toUpperCase();
    }
    else if ( /[\s-_]/.test( letter ) || /[\s/]/.test( letter ) ) {
      shouldConvertToUppercase = true;
    }
    else {
      newName += shouldConvertToUppercase ? letter.toUpperCase() : letter;
      shouldConvertToUppercase = false;
    }
  }
  if ( newName !== "BoatPosition" ) {
    // console.log( "new name:", newName, eventName );
  }
  return newName;
}
/**
 * Sample event name: socketEvent or socket_event
 * Sample mutation name: socketMutateSocketEvent
 * Sample action name: socketActionSocketEvent
 */
Vue.use( VueSocketio, io( process.env.VUE_APP_SERVER_DOMAIN, {
    autoConnect: false,
    reconnection: false
  }),
  {
    store,
    actionPrefix: "socketAction",
    mutationPrefix: "socketMutate",
    eventToMutationTransformer: function( eventName: string ): string {
      if ( eventName == null ) {
        console.log( "!!!!mutation transformer is null!!!!", eventName );/* eslint-disable-line no-console */
        return "";
      }
      return convertEventName( eventName );
    },
    eventToActionTransformer: function( eventName: string ): string {
      if ( eventName == null ) {
        console.log( "!!!!action transformer is null!!!!!", eventName );/* eslint-disable-line no-console */
        return "";
      }
      return convertEventName( eventName );
    }
  })
