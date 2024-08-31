for _ in range(int(input())):
    l,r=map(int,input().split())
    L,R=map(int,input().split())
    
    s1=set(range(l,r+1))
    s2=set(range(L,R+1))

    s1=s1.intersection(s2)
    
    if len(s1)==0:
        print(1)
        continue
    
    c=len(s1)-1
    
    if L<l<R :
        c+=1
    if L<r<R:
        c+=1
    if l<R<r:
        c+=1
    if l<L<r:
        c+=1
        
    print(c)