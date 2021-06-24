from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
class chat_fun(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name="jatiratnalu"

        await self.channel_layer.group_add(self.group_name,self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
       await self.channel_layer.group_discard(
           self.group_name,
           self.channel_name
       )
       print('hey user you are disconnected')



    async def receive(self, text_data):

        receive_data=json.loads(text_data)
        message=receive_data['message']
        action=receive_data['action']
        if (action=="new-offer") or (action=="new-answer"):
            reciver_channel_name= receive_data['message']['reciver_channel_name']
            receive_data['message']['reciver_channel_name']=self.channel_name
            await self.channel_layer.send(
                reciver_channel_name
                 ,
                {
                    'type': 'send_sdp',
                    'receive_data': receive_data,
                }

            )
            return

        receive_data['message']['reciver_channel_name']=self.channel_name




        await self.channel_layer.group_send(
            self.group_name,
            {
                'type':'send.sdp',
                'receive_data':receive_data,
            }

        )
    async  def send_sdp(self,event):
        message=event['receive_data']
        await self.send(text_data=json.dumps(message))

class Audio(AsyncWebsocketConsumer):
    pass