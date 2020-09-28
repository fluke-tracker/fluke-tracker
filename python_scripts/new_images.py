
import pathlib

flist = []
f = open(".\\python_scripts\\demofile3.txt", "w")
for p in pathlib.Path('C:\\Users\\ksinghko\\Pictures\\Lisa New Pictures\\all images\\').iterdir():
    if p.is_file():
        p=str(p)
        p=p.replace("C:\\Users\\ksinghko\\Pictures\\Lisa New Pictures\\all images\\","")
        print(p[:-4])
        p=p[:-4]
        flist.append(p)
        f.write(p+"\n")
f.close()


