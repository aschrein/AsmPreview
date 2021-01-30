# Assembly preview something something

## Build and run

```console
npm install && npm run build && cd build && python ../server.py 4000
```

## Notes

Need to have rga.exe and dxc.exe in PATH.

```c++
// RDNA/GCN assembly 101

clamp(x, a, b) -> v_med3_f32 // Median of 3 numbers is effectively a clamp.

[unroll(8)] for (u32 i = 0; i < 8; i++) {} // May blow up the vreg pressure if there are any loads.
// As the compiler will first prefetch and then do the computation increasing the live range.



```