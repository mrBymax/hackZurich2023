import os
import glob

import multiprocessing
from pdb import run
import time
import requests
import json
import subprocess

# Your foo function
#def foo(n):
    #os.system('python demo/webcam_demo_spatiotemporal_det.py --input-video 0 --config configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py --checkpoint https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth --det-config demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py --det-checkpoint http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth --det-score-thr 0.9 --action-score-thr 0.5 --label-map tools/data/ava/label_map.txt --predict-stepsize 40 --output-fps 5 --out-filename results.mp4')
    #os.system('python demo\webcam_demo_spatiotemporal_det.py --input-video 0 --config configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py --checkpoint https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth --det-config demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py --det-checkpoint http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth --det-score-thr 0.9 --action-score-thr 0.5 --label-map tools/data/ava/label_map.txt --predict-stepsize 40 --output-fps 5 --out-filename results.mp4')

if __name__ == '__main__':

    while(1):
        url_g = 'http://192.168.137.5:8327/status'
        mode_time = requests.get(url_g)
        print('Status: '+str(mode_time.json()['pomodoro']['state']))

        if mode_time.json()['pomodoro']['state']==0:
            link_to_webcam = '0'
            #link_to_webcam = 'rtsp://192.168.137.196:8554/mystream'
            process_a = subprocess.Popen(['python','demo\webcam_demo_spatiotemporal_det.py','--input-video',link_to_webcam,'--config','configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py','--checkpoint','https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth','--det-config','demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py','--det-checkpoint','http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth','--det-score-thr','0.9','--action-score-thr','0.5','--label-map','tools/data/ava/label_map.txt','--predict-stepsize','40','--output-fps','1','--out-filename','results.mp4'])
            process_b = subprocess.Popen(['python','ui_test.py'])
            try:
                print('Running in process', process_b.pid)
                process_a.wait(timeout=100)
                process_b.wait(timeout=100)
            
            except subprocess.TimeoutExpired:
                print('Timed out - killing', process_b.pid)
                process_a.terminate()
                process_b.terminate()
        #elif mode_time.json()['pomodoro']['state']==1:
            #process_a.terminate()
            #process_b.terminate()


        else:
            print("Idling...")

        '''
        elif mode_time.json()['pomodoro']['state']==1:
            #process_b.terminate()

            #if os.path.exists("mouse_track.txt"):
            #    os.remove("mouse_track.txt")

            #print("Running "+str(mode_time.json()['pomodoro']['mode'])+' Mode (0 = study, 1 = game) for time '+mode_time.json()['pomodoro']['time'])
            study_session_time = int(mode_time.json()['pomodoro']['time']) #Time for studying (in seconds)           
            link_to_webcam = '0'
            #link_to_webcam = 'rtsp://192.168.137.196:8554/mystream'
        
            process = subprocess.Popen(['python','demo\webcam_demo_spatiotemporal_det.py','--input-video',link_to_webcam,'--config','configs/detection/slowonly/slowonly_kinetics400-pretrained-r101_8xb16-8x8x1-20e_ava21-rgb.py','--checkpoint','https://download.openmmlab.com/mmaction/detection/ava/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb/slowonly_omnisource_pretrained_r101_8x8x1_20e_ava_rgb_20201217-16378594.pth','--det-config','demo/demo_configs/faster-rcnn_r50_fpn_2x_coco_infer.py','--det-checkpoint','http://download.openmmlab.com/mmdetection/v2.0/faster_rcnn/faster_rcnn_r50_fpn_2x_coco/faster_rcnn_r50_fpn_2x_coco_bbox_mAP-0.384_20200504_210434-a5d8aa15.pth','--det-score-thr','0.9','--action-score-thr','0.5','--label-map','tools/data/ava/label_map.txt','--predict-stepsize','40','--output-fps','5','--out-filename','results.mp4'])
            #process_m = subprocess.Popen(['python','mouse_track.py'])
            process_b1 = subprocess.Popen(['python','ui_test_record.py'])

            try:
                print('Running in process', process.pid)
                process.wait(timeout=study_session_time)
                #process_m.wait(timeout=study_session_time)
                process_b1.wait(timeout=study_session_time)
            except subprocess.TimeoutExpired:
                print('Timed out - killing', process.pid)
                process.terminate()
                #process_m.terminate()
                process_b1.terminate()
                
            print("Done")
            
            activity_data = open("output_results.txt", "r")
            #mouse_data = open("mouse_track.txt","r")
            bci_data = mouse_data = open("openbci_data.txt","r")

            url = 'http://192.168.137.5:8327/activity'
            #url_m = 'http://192.168.137.5:8327/mouse'
            url_b = 'http://192.168.137.5:8327/openbci'

            data =  activity_data.readlines()
            #data_m = mouse_data.readlines()
            data_b = bci_data.readline()

            # Convert the data dictionary to JSON
            json_data = [json.loads(line) for line in data]
            #json_data_m = [json.loads(line) for line in data_m]
            
            # Send the POST request with JSON data
            response = requests.post(url, json=json_data)
            print(response)
            #response_m = requests.post(url_m, json=data_m)
            #print(response_m)
            response_b = requests.post(url_b, json=data_b)
            print(response_b)

        else:
            print("Idling...")
            #process_b1.terminate()
        '''
