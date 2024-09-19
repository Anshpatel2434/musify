
def forJump(start,n,m,s):
    curr,wi,wf=-1,-1,True
    for i in range(start+m,start,-1):
        if s[i] =='L' or i==n:
            print("LAND")
            curr=i
            break
        if s[i]=='W' and wf:
            print("WAter")
            wi=i
            wf=False
    else:
        return wi
    return curr
        
for _ in range(int(input())):
    n,m,k=map(int,input().split())
    s=input()
    
    curr,flag=-1,True
    
    while(flag):
        curr=forJump(curr,n,m,s)
        print("curr1 : ",curr)
        while(curr<n and s[curr]=='L'):
            print("curr2 : ",curr)
            curr=forJump(curr,n,m,s)
        if curr>=n or k<=0:
            break
        for i in range(curr,n):
            if s[i]=='C':
                flag=False
                break
            if s[i]=='L':
                curr=i
                break
            if s[i]=='W':
                k-=1
            if k<=0:
                flag=False
                break

    if curr>=n:
        print("YES")
    else:
        print("NO")