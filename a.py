import math
for _ in range(int(input())):
    x,y,k=map(int,input().split())
    
    ans=math.ceil(max(x,y)/k)
    if x<=y:
        print(ans)
    else:
        print(ans-1)