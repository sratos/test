from tkinter import *
import sys
master = Tk()

lines = tuple(open('1.txt', 'r'))


class Question:
    name = None
    wrong_answers = []
    right_answers = []

#sys.exit(0)

def var_states():
    print("male: %d,\nfemale: %d" % (var1.get(), var2.get()))

questions = []

q = None
for l in lines:
    if l.startswith('Q://'):
        q.name = l
    elif l.startswith('+//'):
        q.right_answers.append(l)
    elif l.startswith('-//'):
        q.wrong_answers.append(l)
    elif l.startswith('---'):
        questions.append(q)
        q = Question()

Label(master, text=questions[0].name, width=80, wraplength=600).grid(row=0, sticky=W)
var1 = IntVar()
var2 = IntVar()
it=1
for wa in questions[0].wrong_answers:
    Checkbutton(master, text=wa, variable=var1).grid(row=it, sticky=W)
    it+=1

Checkbutton(master, text="female", variable=var2).grid(row=2, sticky=W)
Button(master, text='Quit', command=master.quit).grid(row=3, sticky=W, pady=4)
Button(master, text='Show', command=var_states).grid(row=4, sticky=W, pady=4)
mainloop()