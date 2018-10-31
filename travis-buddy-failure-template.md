## Build failed
Hey **{{author}}**, 
Please read the following log in order to understand the failure reason. 
It'll be awesome if you fix what's wrong and commit the changes.

{{#jobs}}
### {{displayName}}
{{#scripts}}
<details>
  <summary>
    <strong>
     {{command}}
    </strong>
  </summary>

```
{{&contents}}
```
</details>
<br />
{{/scripts}}
{{/jobs}}
