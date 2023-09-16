import pyautogui
import time
import pandas as pd
import gc

ctr = 0

while(1):
    f_m = open("mouse_track.txt", "a+")
    ctr = ctr+1
    if ctr % 5000 == 0:
        x, y = pyautogui.position()
        f_m.write(str(x)+','+str(y)+'\n')
    f_m.close()