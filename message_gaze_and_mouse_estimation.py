import os
import glob

import multiprocessing
from pdb import run
import time
import requests
import json
import subprocess
import pandas as pd
# import cv2

# Your foo function
#def foo(n):
    #os.system('python demo/webcam_demo_spatiotemporal_det.py --input-video 0 --config configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py --checkpoint https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth --det-config demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py --det-checkpoint http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth --det-score-thr 0.9 --action-score-thr 0.5 --label-map tools/data/ava/label_map.txt --predict-stepsize 40 --output-fps 5 --out-filename results.mp4')
    #os.system('python demo/webcam_demo_spatiotemporal_det.py --input-video rtsp://192.168.137.196:8554/mystream --config configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py --checkpoint https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth --det-config demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py --det-checkpoint http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth --det-score-thr 0.9 --action-score-thr 0.5 --label-map tools/data/ava/label_map.txt --predict-stepsize 40 --output-fps 5 --out-filename results.mp4 & python mouse_track.py')

if __name__ == '__main__':

    process = None
    process_m = None
    while(1):
        url_g = 'http://192.168.137.5:8327/status'
        mode_time = requests.get(url_g)
        print('Status: '+str(mode_time.json()['pomodoro']['state']))

        if mode_time.json()['pomodoro']['state']==0:
            if os.path.exists("mouse_track.txt"):
                os.remove("mouse_track.txt")

            #print("Running "+str(mode_time.json()['pomodoro']['mode'])+' Mode (0 = study, 1 = game) for time '+mode_time.json()['pomodoro']['time'])
            study_session_time = int(mode_time.json()['pomodoro']['time'])  / 2 #Time for studying (in seconds)           
            link_to_webcam = '0'
            #link_to_webcam = 'rtsp://192.168.137.196:8554/mystream'
        
            print('Study session time: '+str(study_session_time)+' seconds')
            # process = subprocess.Popen(['python','demo\webcam_demo_spatiotemporal_det.py','--input-video',link_to_webcam,'--config','configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py','--checkpoint','https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth','--det-config','demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py','--det-checkpoint','http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth','--det-score-thr','0.9','--action-score-thr','0.5','--label-map','tools/data/ava/label_map.txt','--predict-stepsize','40','--output-fps','5','--out-filename','results.mp4'])
            if(process is None):
                process = subprocess.Popen(['python', 'gaze_estimation/gaze_2d_csv.py'])
            if(process_m is None):
                process_m = subprocess.Popen(['python','mouse_track.py'])
 
        elif mode_time.json()['pomodoro']['state']==1:
 
            try:
                print('Running in process', process.pid)
                process.wait(timeout=study_session_time)
                process_m.wait(timeout=study_session_time)
                # process_b1.wait(timeout=study_session_time)
            except subprocess.TimeoutExpired:
                print('Timed out - killing', process.pid)
                process.terminate()
                process_m.terminate()


                print(f'Process {process.pid} was terminated')
                print(f'Process {process_m.pid} was terminated')

                process = None
                process_m = None
                # process_b1.terminate()
                
            print("Done")
            
            gaze_rate = pd.read_csv('gaze_rate.csv')
            gaze_minute = pd.read_csv('gaze_minute.csv')
            gaze_second = pd.read_csv('gaze_second.csv')



            url_gaze = 'http://192.168.137.5:8327/gaze'
            url_m = 'http://192.168.137.5:8327/mouse'
            url_gaze_mouse = 'http://192.168.137.5:8327/gaze_mouse'
            # url_b = 'http://192.168.137.5:8327/openbci'

            #data =  activity_data.readlines()

            with open("mouse_track.txt") as mouse_data:
                data_m = mouse_data.readlines()
                # Parse the lines and create a list of dictionaries with x and y values
            coordinates = []
            for line in data_m:
                x, y = map(int, line.strip().split(","))
                coordinates.append({"x": x, "y": y})
            # Convert the list to JSON format
            mouse_json_output = json.dumps(coordinates)
            # print(coordinates)

            # Write the JSON data to a file if you want to
            with open("mouse_track.json", "w") as f:
                f.write(mouse_json_output)


            
            # Send the POST request with JSON data
            gaze_rate_json = gaze_rate.to_json(orient="split", index=False)

            gaze_rate_json = json.loads(gaze_rate_json)
            
            # response = requests.post(url_gaze, json=gaze_rate_json)
            # print(response)
            # response_m = requests.post(url_m, json=data_m)
            # response_m = requests.post(url_m, json=coordinates)
            # print(response_m)

            response_combined = requests.post(
                url_gaze_mouse, 
                json={
                    "gaze": gaze_rate_json,
                    "mouse" : coordinates
                }
            )

            print(response_combined)
        

        else:
            print("Idling...")
            try:
                process.terminate()
                process_m.terminate()

                print(f'Process {process.pid} was terminated')
                print(f'Process {process_m.pid} was terminated')
                process = None
                process_m = None
            except:
                print('Process for gaze and mouse werent even started')
