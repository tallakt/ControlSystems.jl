var documenterSearchIndex = {"docs": [

{
    "location": "examples/example/#",
    "page": "LQR design",
    "title": "LQR design",
    "category": "page",
    "text": "DocTestSetup = quote\n    using ControlSystems\nend"
},

{
    "location": "examples/example/#LQR-design-1",
    "page": "LQR design",
    "title": "LQR design",
    "category": "section",
    "text": "using LinearAlgebra # For identity matrix I\nh       = 0.1\nA       = [1 h; 0 1]\nB       = [0;1]\nC       = [1 0]\nsys     = ss(A,B,C,0, h)\nQ       = I\nR       = I\nL       = dlqr(A,B,Q,R) # lqr(sys,Q,R) can also be used\n\nu(t,x)  = -L*x + 1.5(t>=2.5)# Form control law (u is a function of t and x), a constant input disturbance is affecting the system from t≧2.5\nt       =0:h:5\nx0      = [1,0]\ny, t, x, uout = lsim(sys,u,t,x0)\nplot(t,x, lab=[\"Position\", \"Velocity\"]\', xlabel=\"Time [s]\")(Image: )"
},

{
    "location": "examples/example/#LQR-design-2",
    "page": "LQR design",
    "title": "LQR design",
    "category": "section",
    "text": "using LinearAlgebra # For identity matrix I\nh       = 0.1\nA       = [1 h; 0 1]\nB       = [0;1]\nC       = [1 0]\nsys     = ss(A,B,C,0, h)\nQ       = I\nR       = I\nL       = dlqr(A,B,Q,R) # lqr(sys,Q,R) can also be used\n\nu(t,x)  = -L*x + 1.5(t>=2.5)# Form control law (u is a function of t and x), a constant input disturbance is affecting the system from t≧2.5\nt       =0:h:5\nx0      = [1,0]\ny, t, x, uout = lsim(sys,u,t,x0)\nplot(t,x, lab=[\"Position\", \"Velocity\"]\', xlabel=\"Time [s]\")(Image: )"
},

{
    "location": "examples/example/#PID-design-functions-1",
    "page": "LQR design",
    "title": "PID design functions",
    "category": "section",
    "text": "By plotting the gang of four under unit feedback for the processP = tf(1,[1,1])^4\ngangoffourplot(P,tf(1))(Image: )we notice that the sensitivity function is a bit too high at around frequencies ω = 0.8 rad/s. Since we want to control the process using a simple PI-controller, we utilize the function loopshapingPI and tell it that we want 60 degrees phase margin at this frequency. The resulting gang of four is plotted for both the constructed controller and for unit feedback.ωp = 0.8\nkp,ki,C = loopshapingPI(P,ωp,phasemargin=60, doplot=true)(Image: ) (Image: )We could also cosider a situation where we want to create a closed-loop system with the bandwidth ω = 2 rad/s, in which case we would write something likeωp = 2\nkp,ki,C60 = loopshapingPI(P,ωp,rl=1,phasemargin=60, doplot=true)Here we specify that we want the Nyquist curve L(iω) = P(iω)C(iω) to pass the point |L(iω)| = rl = 1,  arg(L(iω)) = -180 + phasemargin = -180 + 60 The gang of four tells us that we can indeed get a very robust and fast controller with this design method, but it will cost us significant control action to double the bandwidth of all four poles. (Image: ) (Image: )"
},

{
    "location": "examples/example/#Advanced-pole-zero-placement-1",
    "page": "LQR design",
    "title": "Advanced pole-zero placement",
    "category": "section",
    "text": "This example illustrates how we can perform advanced pole-zero placement. The task is to make the process a bit faster and damp the poorly damped poles.Define the processζ = 0.2\nω = 1\n\nB = [1]\nA   = [1, 2ζ*ω, ω^2]\nP  = tf(B,A)\n\n# output\n\nTransferFunction:\n      1.0\n----------------\ns^2 + 0.4s + 1.0\n\nContinuous-time transfer function modelDefine the desired closed loop response, calculate the controller polynomials and simulate the closed-loop system. The design utilizes an observer poles twice as fast as the closed-loop poles. An additional observer pole is added in order to get a casual controller when an integrator is added to the controller.# Control design\nζ0 = 0.7\nω0 = 2\nAm = [1, 2ζ0*ω0, ω0^2]\nAo = conv(2Am, [1/2, 1]) # Observer polynomial, add extra pole due to the integrator\nAR = [1,0] # Force the controller to contain an integrator ( 1/(s+0) )\n\nB⁺  = [1] # The process numerator polynomial can be facored as B = B⁺B⁻ where B⁻ contains the zeros we do not want to cancel (non-minimum phase and poorly damped zeros)\nB⁻  = [1]\nBm  = conv(B⁺, B⁻) # In this case, keep the entire numerator polynomial of the process\n\nR,S,T = rstc(B⁺,B⁻,A,Bm,Am,Ao,AR) # Calculate the 2-DOF controller polynomials\n\nGcl = tf(conv(B,T),zpconv(A,R,B,S)) # Form the closed loop polynomial from reference to output, the closed-loop characteristic polynomial is AR + BS, the function zpconv takes care of the polynomial multiplication and makes sure the coefficient vectores are of equal length\n\nstepplot([P,Gcl]) # Visualize the open and closed loop responses.\ngangoffourplot(P, tf(-S,R)) # Plot the gang of four to check that all tranfer functions are OK(Image: ) (Image: )"
},

{
    "location": "examples/example/#Stability-boundary-for-PID-controllers-1",
    "page": "LQR design",
    "title": "Stability boundary for PID controllers",
    "category": "section",
    "text": "The stability boundary, where the transfer function P(s)C(s) = -1, can be plotted with the command stabregionPID. The process can be given in string form or as a regular LTIsystem.P1 = \"exp(-sqrt(s))\"\nf1 = stabregionPID(P1,exp10.(range(-5, stop=1, length=1000)))\nP2 = \"100*(s+6).^2./(s.*(s+1).^2.*(s+50).^2)\"\nf2 = stabregionPID(P2,exp10.(range(-5, stop=2, length=1000)))\nP3 = tf(1,[1,1])^4\nf3 = stabregionPID(P3,exp10.(range(-5, stop=0, length=1000)))(Image: ) (Image: ) (Image: )"
},

{
    "location": "examples/example/#PID-plots-1",
    "page": "LQR design",
    "title": "PID plots",
    "category": "section",
    "text": "This example utilizes the function pidplots, which accepts vectors of PID-parameters and produces relevant plots. The task is to take a system with bandwidth 1 rad/s and produce a closed-loop system with bandwidth 0.1 rad/s. If one is not careful and proceed with pole placement, one easily get a system with very poor robustness.P = tf([1.],[1., 1])\n\nζ = 0.5 # Desired damping\n\nws = exp10.(range(-1, stop=2, length=8)) # A vector of closed-loop bandwidths\nkp = 2*ζ*ws-1 # Simple pole placement with PI given the closed-loop bandwidth, the poles are placed in a butterworth pattern\nki = ws.^2\npidplots(P,:nyquist,:gof;kps=kp,kis=ki, ω= exp10.(range(-2, stop=2, length=500))) # Request Nyquist and Gang-of-four plots (more plots are available, see ?pidplots )(Image: ) (Image: )Now try a different strategy, where we have specified a gain crossover frequency of 0.1 rad/skp = range(-1, stop=1, length=8) #\nki = sqrt(1-kp.^2)/10\npidplots(P,:nyquist,:gof;kps=kp,kis=ki)(Image: ) (Image: )"
},

{
    "location": "#",
    "page": "ControlSystems.jl Manual",
    "title": "ControlSystems.jl Manual",
    "category": "page",
    "text": ""
},

{
    "location": "#ControlSystems.jl-Manual-1",
    "page": "ControlSystems.jl Manual",
    "title": "ControlSystems.jl Manual",
    "category": "section",
    "text": "CurrentModule = ControlSystems"
},

{
    "location": "#Examples-1",
    "page": "ControlSystems.jl Manual",
    "title": "Examples",
    "category": "section",
    "text": "Pages = [\"examples/example.md\"]\nDepth = 1"
},

{
    "location": "#Guide-1",
    "page": "ControlSystems.jl Manual",
    "title": "Guide",
    "category": "section",
    "text": "Pages = [\"man/introduction.md\", \"man/creatingtfs.md\"]\nDepth = 1"
},

{
    "location": "#Functions-1",
    "page": "ControlSystems.jl Manual",
    "title": "Functions",
    "category": "section",
    "text": "Pages = [\"lib/constructors.md\", \"lib/plotting.md\"]"
},

{
    "location": "#Documentation-Index-1",
    "page": "ControlSystems.jl Manual",
    "title": "Documentation Index",
    "category": "section",
    "text": "Pages = [\"lib/constructors.md\", \"lib/plotting.md\", \"lib/syntheis.md\", \"lib/timefreqresponse.md\", \"lib/analysis.md\"]\nDepth = 1"
},

{
    "location": "lib/analysis/#",
    "page": "Analysis",
    "title": "Analysis",
    "category": "page",
    "text": "Pages = [\"analysis.md\"]"
},

{
    "location": "lib/analysis/#ControlSystems.covar",
    "page": "Analysis",
    "title": "ControlSystems.covar",
    "category": "function",
    "text": "P = covar(sys, W)\n\nCalculate the stationary covariance P = E[y(t)y(t)\'] of an lti-model sys, driven by gaussian white noise \'w\' of covariance E[w(t)w(τ)]=W*δ(t-τ) where δ is the dirac delta.\n\nThe ouput is if Inf if the system is unstable. Passing white noise directly to the output will result in infinite covariance in the corresponding outputs (DWD\' .!= 0) for contunuous systems.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.ctrb",
    "page": "Analysis",
    "title": "ControlSystems.ctrb",
    "category": "function",
    "text": "ctrb(A, B) or ctrb(sys)\n\nCompute the controllability matrix for the system described by (A, B) or sys.\n\nNote that checking for controllability by computing the rank from ctrb is not the most numerically accurate way, a better method is checking if gram(sys, :c) is positive definite.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.damp",
    "page": "Analysis",
    "title": "ControlSystems.damp",
    "category": "function",
    "text": "Wn, zeta, ps = damp(sys)\n\nCompute the natural frequencies, Wn, and damping ratios, zeta, of the poles, ps, of sys\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.dampreport",
    "page": "Analysis",
    "title": "ControlSystems.dampreport",
    "category": "function",
    "text": "dampreport(sys)\n\nDisplay a report of the poles, damping ratio, natural frequency, and time constant of the system sys\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.dcgain",
    "page": "Analysis",
    "title": "ControlSystems.dcgain",
    "category": "function",
    "text": "dcgain(sys)\n\nCompute the dcgain of system sys.\n\nequal to G(0) for continuous-time systems and G(1) for discrete-time systems.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.delaymargin",
    "page": "Analysis",
    "title": "ControlSystems.delaymargin",
    "category": "function",
    "text": "dₘ = delaymargin(G::LTISystem)\n\nOnly supports SISO systems\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.gangoffour",
    "page": "Analysis",
    "title": "ControlSystems.gangoffour",
    "category": "function",
    "text": "S,D,N,T = gangoffour(P,C), gangoffour(P::AbstractVector,C::AbstractVector)\n\nGiven a transfer function describing the Plant P and a transferfunction describing the controller C, computes the four transfer functions in the Gang-of-Four.\n\nS = 1/(1+PC) Sensitivity function\n\nD = P/(1+PC)\n\nN = C/(1+PC)\n\nT = PC/(1+PC) Complementary sensitivity function\n\nOnly supports SISO systems\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.gangofseven",
    "page": "Analysis",
    "title": "ControlSystems.gangofseven",
    "category": "function",
    "text": "S, D, N, T, RY, RU, RE = gangofseven(P,C,F)\n\nGiven transfer functions describing the Plant P, the controller C and a feed forward block F, computes the four transfer functions in the Gang-of-Four and the transferfunctions corresponding to the feed forward.\n\nS = 1/(1+PC) Sensitivity function\n\nD = P/(1+PC)\n\nN = C/(1+PC)\n\nT = PC/(1+PC) Complementary sensitivity function\n\nRY = PCF/(1+PC)\n\nRU = CF/(1+P*C)\n\nRE = F/(1+P*C)\n\nOnly supports SISO systems\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.gram",
    "page": "Analysis",
    "title": "ControlSystems.gram",
    "category": "function",
    "text": "gram(sys, opt)\n\nCompute the grammian of system sys. If opt is :c, computes the controllability grammian. If opt is :o, computes the observability grammian.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.margin",
    "page": "Analysis",
    "title": "ControlSystems.margin",
    "category": "function",
    "text": "ωgₘ, gₘ, ωϕₘ, ϕₘ = margin{S<:Real}(sys::LTISystem, w::AbstractVector{S}; full=false, allMargins=false)\n\nreturns frequencies for gain margins, gain margins, frequencies for phase margins, phase margins\n\nIf !allMargins, return only the smallest margin\n\nIf full return also fullPhase\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.markovparam",
    "page": "Analysis",
    "title": "ControlSystems.markovparam",
    "category": "function",
    "text": "markovparam(sys, n)\n\nCompute the nth markov parameter of state-space system sys. This is defined as the following:\n\nh(0) = D\n\nh(n) = C*A^(n-1)*B\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#LinearAlgebra.norm",
    "page": "Analysis",
    "title": "LinearAlgebra.norm",
    "category": "function",
    "text": "..  norm(sys, p=2; tol=1e-6)\n\nnorm(sys) or norm(sys,2) computes the H2 norm of the LTI system sys.\n\nnorm(sys, Inf) computes the L∞ norm of the LTI system sys. The H∞ norm is the same as the L∞ for stable systems, and Inf for unstable systems. If the peak gain frequency is required as well, use the function norminf instead.\n\ntol is an optional keyword argument, used only for the computation of L∞ norms. It represents the desired relative accuracy for the computed L∞ norm (this is not an absolute certificate however).\n\nsys is first converted to a state space model if needed.\n\nThe L∞ norm computation implements the \'two-step algorithm\' in: N.A. Bruinsma and M. Steinbuch, \'A fast algorithm to compute the H∞-norm of a transfer function matrix\', Systems and Control Letters 14 (1990), pp. 287-293. For the discrete-time version, see, e.g.,: P. Bongers, O. Bosgra, M. Steinbuch, \'L∞-norm calculation for generalized state space systems in continuous and discrete time\', American Control Conference, 1991.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.obsv",
    "page": "Analysis",
    "title": "ControlSystems.obsv",
    "category": "function",
    "text": "obsv(A, C) or obsv(sys)\n\nCompute the observability matrix for the system described by (A, C) or sys.\n\nNote that checking for observability by computing the rank from obsv is not the most numerically accurate way, a better method is checking if gram(sys, :o) is positive definite.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.pole",
    "page": "Analysis",
    "title": "ControlSystems.pole",
    "category": "function",
    "text": "pole(sys)\n\nCompute the poles of system sys.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.sigma",
    "page": "Analysis",
    "title": "ControlSystems.sigma",
    "category": "function",
    "text": "sv, w = sigma(sys[, w])\n\nCompute the singular values of the frequency response of system sys at frequencies w\n\nsv has size (length(w), max(ny, nu))\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.stabregionPID",
    "page": "Analysis",
    "title": "ControlSystems.stabregionPID",
    "category": "function",
    "text": "fig, kp, ki = stabregionPID(P, [ω]; kd=0, doplot = true)\n\nSegments of the curve generated by this program is the boundary of the stability region for a process with transfer function P(s) The PID controller is assumed to be on the form kp +ki/s +kd s\n\nThe curve is found by analyzing P(s)*C(s) = -1 ⟹ |PC| = |P| |C| = 1 arg(P) + arg(C) = -π\n\nIf P is a function (e.g. s -> exp(-sqrt(s)) ), the stability of feedback loops using PI-controllers can be analyzed for processes with models with arbitrary analytic functions\n\nSee also stabregionPID, loopshapingPI, pidplots\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.tzero",
    "page": "Analysis",
    "title": "ControlSystems.tzero",
    "category": "function",
    "text": "tzero(sys)\n\nCompute the invariant zeros of the system sys. If sys is a minimal realization, these are also the transmission zeros.\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#ControlSystems.zpkdata",
    "page": "Analysis",
    "title": "ControlSystems.zpkdata",
    "category": "function",
    "text": "z, p, k = zpkdata(sys)\n\nCompute the zeros, poles, and gains of system sys.\n\nReturns\n\nz : Matrix{Vector{ComplexF64}}, (ny x nu)\n\np : Matrix{Vector{ComplexF64}}, (ny x nu)\n\nk : Matrix{Float64}, (ny x nu)\n\n\n\n\n\n"
},

{
    "location": "lib/analysis/#Analysis-1",
    "page": "Analysis",
    "title": "Analysis",
    "category": "section",
    "text": "covar\nctrb\ndamp\ndampreport\ndcgain\ndelaymargin\ngangoffour\ngangofseven\ngram\nmargin\nmarkovparam\nnorm\nobsv\npole\nsigma\nstabregionPID\ntzero\nzpkdata"
},

{
    "location": "lib/constructors/#",
    "page": "Constructing transfer functions",
    "title": "Constructing transfer functions",
    "category": "page",
    "text": "Pages = [\"constructors.md\"]"
},

{
    "location": "lib/constructors/#ControlSystems.append",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.append",
    "category": "function",
    "text": "append(systems::StateSpace...), append(systems::TransferFunction...)\n\nAppend systems in block diagonal form\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.c2d",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.c2d",
    "category": "function",
    "text": "[sysd, x0map] = c2d(sys, Ts, method=:zoh)\n\nConvert the continuous system sys into a discrete system with sample time Ts, using the provided method. Currently only :zoh and :foh are provided.\n\nReturns the discrete system sysd, and a matrix x0map that transforms the initial conditions to the discrete domain by x0_discrete = x0map*[x0; u0]\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.feedback",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.feedback",
    "category": "function",
    "text": "feedback(L) Returns L/(1+L) feedback(P1,P2) Returns P1/(1+P1*P2)\n\n\n\n\n\nfeedback(sys)\n\nfeedback(sys1,sys2)\n\nForms the negative feedback interconnection\n\n>-+ sys1 +-->\n  |      |\n (-)sys2 +\n\nIf no second system is given, negative identity feedback is assumed\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.feedback2dof",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.feedback2dof",
    "category": "function",
    "text": "feedback2dof(P,R,S,T) Return BT/(AR+ST) where B and A are the numerator and denomenator polynomials of P respectively feedback2dof(B,A,R,S,T) Return BT/(AR+ST)\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.minreal",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.minreal",
    "category": "function",
    "text": "tf = minreal(tf::TransferFunction, eps=sqrt(eps()))\n\nCreate a minimial representation of each transfer function in tf by cancelling poles and zeros will promote system to an appropriate numeric type\n\n\n\n\n\nminsys = minreal(s::StateSpace, tol=sqrt(eps())) is implemented via baltrunc and returns a system on diagonal form.\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.parallel",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.parallel",
    "category": "function",
    "text": "series(sys1::LTISystem, sys2::LTISystem)\n\nConnect systems in parallel, equivalent to sys2+sys1\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.series",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.series",
    "category": "function",
    "text": "series(sys1::LTISystem, sys2::LTISystem)\n\nConnect systems in series, equivalent to sys2*sys1\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.sminreal",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.sminreal",
    "category": "function",
    "text": "sminreal(sys)\n\nCompute the structurally minimal realization of the state-space system sys. A structurally minimal realization is one where only states that can be determined to be uncontrollable and unobservable based on the location of 0s in sys are removed.\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.ss",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.ss",
    "category": "function",
    "text": "sys = ss(A, B, C, D, Ts=0) -> sys\n\nCreate a state-space model sys::StateSpace{T, MT<:AbstractMatrix{T}} where MT is the type of matrixes A,B,C,D and T the element type.\n\nThis is a continuous-time model if Ts is omitted or set to 0. Otherwise, this is a discrete-time model with sampling period Ts. Set Ts=-1 for a discrete-time model with unspecified sampling period.\n\nsys = ss(D[, Ts, ...]) specifies a static gain matrix D.\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.tf",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.tf",
    "category": "function",
    "text": "sys = tf(num, den, Ts=0), sys = tf(gain, Ts=0)\n\nCreate as a fraction of polynomials:\n\nsys::TransferFunction{SisoRational{T,TR}} = numerator/denominator where T is the type of the coefficients in the polynomial.\n\nnum: the coefficients of the numerator polynomial. Either scalar or vector to create SISO systems or an array of vectors to create MIMO system.\n\nden: the coefficients of the denominator polynomial. Either vector to create SISO systems or an array of vectors to create MIMO system.\n\nTs: Sample time or 0 for continuous system.\n\nOther uses: tf(sys): Convert sys to tf form. tf(\"s\"), tf(\"z\"): Create the continous transferfunction s.\n\nSee also: zpk, ss\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#ControlSystems.zpk",
    "page": "Constructing transfer functions",
    "title": "ControlSystems.zpk",
    "category": "function",
    "text": "zpk(gain, Ts=0), zpk(num, den, k, Ts=0), zpk(sys)\n\nCreate transfer function on zero pole gain form. The numerator and denominator are represented by their poles and zeros.\n\nsys::TransferFunction{SisoZpk{T,TR}} = k*numerator/denominator where T is the type of k and TR the type of the zeros/poles, usually Float64 and Complex{Float64}.\n\nnum: the roots of the numerator polynomial. Either scalar or vector to create SISO systems or an array of vectors to create MIMO system.\n\nden: the roots of the denominator polynomial. Either vector to create SISO systems or an array of vectors to create MIMO system.\n\nk: The gain of the system. Obs, this is not the same as dcgain.\n\nTs: Sample time or 0 for continuous system.\n\nOther uses:\n\nzpk(sys): Convert sys to zpk form.\n\nzpk(\"s\"): Create the transferfunction s.\n\n\n\n\n\n"
},

{
    "location": "lib/constructors/#Constructing-transfer-functions-1",
    "page": "Constructing transfer functions",
    "title": "Constructing transfer functions",
    "category": "section",
    "text": "append\nc2d\nfeedback\nfeedback2dof\nminreal\nparallel\nseries\nsminreal\nss\ntf\nzpk"
},

{
    "location": "lib/plotting/#",
    "page": "Plotting functions",
    "title": "Plotting functions",
    "category": "page",
    "text": "Pages = [\"plotting.md\"]"
},

{
    "location": "lib/plotting/#ControlSystems.bodeplot",
    "page": "Plotting functions",
    "title": "ControlSystems.bodeplot",
    "category": "function",
    "text": "fig = bodeplot(sys, args...), bodeplot(LTISystem[sys1, sys2...], args...; plotphase=true, kwargs...)\n\nCreate a Bode plot of the LTISystem(s). A frequency vector w can be optionally provided.\n\nkwargs is sent as argument to Plots.plot.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.gangoffourplot",
    "page": "Plotting functions",
    "title": "ControlSystems.gangoffourplot",
    "category": "function",
    "text": "fig = gangoffourplot(P::LTISystem, C::LTISystem), gangoffourplot(P::Union{Vector, LTISystem}, C::Vector; plotphase=false)\n\nGang-of-Four plot.\n\nkwargs is sent as argument to Plots.plot.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.impulseplot",
    "page": "Plotting functions",
    "title": "ControlSystems.impulseplot",
    "category": "function",
    "text": "impulseplot(sys[, Tf[,  Ts]])\n\nPlot step response of sys with optional final time Tf and discretization time Ts. If not defined, suitable values are chosen based on sys.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.leadlinkcurve",
    "page": "Plotting functions",
    "title": "ControlSystems.leadlinkcurve",
    "category": "function",
    "text": "Plot the phase advance as a function of N for a lead link (phase advance link)\n\nIf an input argument s is given, the curve is plotted from s to 10, else from 1 to 10.\n\nSee also Leadlink, leadlinkat\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.lsimplot",
    "page": "Plotting functions",
    "title": "ControlSystems.lsimplot",
    "category": "function",
    "text": "fig = lsimplot(sys::LTISystem, u, t; x0=0, method)\n\nlsimplot(LTISystem[sys1, sys2...], u, t; x0, method)\n\nCalculate the time response of the LTISystem(s) to input u. If x0 is not specified, a zero vector is used.\n\nContinuous time systems are discretized before simulation. By default, the method is chosen based on the smoothness of the input signal. Optionally, the method parameter can be specified as either :zoh or :foh.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.marginplot",
    "page": "Plotting functions",
    "title": "ControlSystems.marginplot",
    "category": "function",
    "text": "fig = marginplot(sys::LTISystem [,w::AbstractVector];  kwargs...), marginplot(sys::Vector{LTISystem}, w::AbstractVector;  kwargs...)\n\nPlot all the amplitude and phase margins of the system(s) sys. A frequency vector w can be optionally provided.\n\nkwargs is sent as argument to Plots.plot.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.nicholsplot",
    "page": "Plotting functions",
    "title": "ControlSystems.nicholsplot",
    "category": "function",
    "text": "fig = nicholsplot{T<:LTISystem}(systems::Vector{T}, w::AbstractVector; kwargs...)\n\nCreate a Nichols plot of the LTISystem(s). A frequency vector w can be optionally provided.\n\nKeyword arguments:\n\ntext = true\nGains = [12, 6, 3, 1, 0.5, -0.5, -1, -3, -6, -10, -20, -40, -60]\npInc = 30\nsat = 0.4\nval = 0.85\nfontsize = 10\n\npInc determines the increment in degrees between phase lines.\n\nsat ∈ [0,1] determines the saturation of the gain lines\n\nval ∈ [0,1] determines the brightness of the gain lines\n\nAdditional keyword arguments are sent to the function plotting the systems and can be used to specify colors, line styles etc. using regular Plots.jl syntax\n\nThis function is based on code subject to the two-clause BSD licence Copyright 2011 Will Robertson Copyright 2011 Philipp Allgeuer\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.nyquistplot",
    "page": "Plotting functions",
    "title": "ControlSystems.nyquistplot",
    "category": "function",
    "text": "fig = nyquistplot(sys; gaincircles=true, kwargs...), nyquistplot(LTISystem[sys1, sys2...]; gaincircles=true, kwargs...)\n\nCreate a Nyquist plot of the LTISystem(s). A frequency vector w can be optionally provided.\n\ngaincircles plots the circles corresponding to |S(iω)| = 1 and |T(iω)| = 1, where S and T are the sensitivity and complementary sensitivity functions.\n\nkwargs is sent as argument to plot.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.pidplots",
    "page": "Plotting functions",
    "title": "ControlSystems.pidplots",
    "category": "function",
    "text": "Plots interesting figures related to closing the loop around process P with a PID controller Send in a bunch of PID-parameters in any of the vectors kp, ki, kd. The vectors must be the same length.\n\ntime indicates whether or not the parameters are given as gains (default) or as time constants\n\nseries indicates  whether or not the series form or parallel form (default) is desired\n\nAvailable plots are :gof for Gang of four, :nyquist, :controller for a bode plot of the controller TF and :pz for pole-zero maps\n\nOne can also supply a frequency vector ω to be used in Bode and Nyquist plots\n\npidplots(P, args...; kps=0, kis=0, kds=0, time=false, series=false, ω=0)\n\nSee also loopshapingPI, stabregionPID\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.pzmap",
    "page": "Plotting functions",
    "title": "ControlSystems.pzmap",
    "category": "function",
    "text": "fig = pzmap(fig, system, args...; kwargs...)\n\nCreate a pole-zero map of the LTISystem(s) in figure fig, args and kwargs will be sent to the scatter plot command.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.rlocus",
    "page": "Plotting functions",
    "title": "ControlSystems.rlocus",
    "category": "function",
    "text": "rlocusplot(P::LTISystem, K)\n\nComputes and plots the root locus of the SISO LTISystem P with a negative feedback loop and feedback gains K, if K is not provided, range(1e-6,stop=500,length=10000) is used. If OrdinaryDiffEq.jl is installed and loaded by the user (using OrdinaryDiffEq), rlocusplot will use an adaptive step-size algorithm to select values of K. A scalar Kmax can then be given as second argument.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.sigmaplot",
    "page": "Plotting functions",
    "title": "ControlSystems.sigmaplot",
    "category": "function",
    "text": "sigmaplot(sys, args...), sigmaplot(LTISystem[sys1, sys2...], args...)\n\nPlot the singular values of the frequency response of the LTISystem(s). A frequency vector w can be optionally provided.\n\nkwargs is sent as argument to Plots.plot.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.setPlotScale",
    "page": "Plotting functions",
    "title": "ControlSystems.setPlotScale",
    "category": "function",
    "text": "setPlotScale(str)\n\nSet the default scale of magnitude in bodeplot and sigmaplot. str should be either \"dB\" or \"log10\".\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#ControlSystems.stepplot",
    "page": "Plotting functions",
    "title": "ControlSystems.stepplot",
    "category": "function",
    "text": "stepplot(sys[, Tf[,  Ts]])\n\nPlot step response of sys with optional final time Tf and discretization time Ts. If not defined, suitable values are chosen based on sys.\n\n\n\n\n\n"
},

{
    "location": "lib/plotting/#Plotting-functions-1",
    "page": "Plotting functions",
    "title": "Plotting functions",
    "category": "section",
    "text": "bodeplot\ngangoffourplot\nimpulseplot\nleadlinkcurve\nlsimplot\nmarginplot\nnicholsplot\nnyquistplot\npidplots\npzmap\nrlocus\nsigmaplot\nsetPlotScale\nstepplot"
},

{
    "location": "lib/synthesis/#",
    "page": "Synthesis",
    "title": "Synthesis",
    "category": "page",
    "text": "Pages = [\"synthesis.md\"]"
},

{
    "location": "lib/synthesis/#ControlSystems.balance",
    "page": "Synthesis",
    "title": "ControlSystems.balance",
    "category": "function",
    "text": "T, B = balance(A[, perm=true])\n\nCompute a similarity transform T resulting in B = T\\A*T such that the row and column norms of B are approximately equivalent. If perm=false, the transformation will only scale, and not permute A.\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.care",
    "page": "Synthesis",
    "title": "ControlSystems.care",
    "category": "function",
    "text": "care(A, B, Q, R)\n\nCompute \'X\', the solution to the continuous-time algebraic Riccati equation, defined as A\'X + XA - (XB)R^-1(B\'X) + Q = 0, where R is non-singular.\n\nAlgorithm taken from: Laub, \"A Schur Method for Solving Algebraic Riccati Equations.\" http://dspace.mit.edu/bitstream/handle/1721.1/1301/R-0859-05666488.pdf\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.dab",
    "page": "Synthesis",
    "title": "ControlSystems.dab",
    "category": "function",
    "text": "DAB   Solves the Diophantine-Aryabhatta-Bezout identity\n\nX,Y = DAB(A,B,C)\n\nAX + BY = C, where A, B, C, X and Y are polynomials and deg Y = deg A - 1.\n\nSee Computer-Controlled Systems: Theory and Design, Third Edition Karl Johan Åström, Björn Wittenmark\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.dare",
    "page": "Synthesis",
    "title": "ControlSystems.dare",
    "category": "function",
    "text": "dare(A, B, Q, R)\n\nCompute X, the solution to the discrete-time algebraic Riccati equation, defined as A\'XA - X - (A\'XB)(B\'XB + R)^-1(B\'XA) + Q = 0, where A and R are non-singular.\n\nAlgorithm taken from: Laub, \"A Schur Method for Solving Algebraic Riccati Equations.\" http://dspace.mit.edu/bitstream/handle/1721.1/1301/R-0859-05666488.pdf\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.dkalman",
    "page": "Synthesis",
    "title": "ControlSystems.dkalman",
    "category": "function",
    "text": "dkalman(A, C, R1, R2) kalman(sys, R1, R2)`\n\nCalculate the optimal Kalman gain for discrete time systems\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.dlqr",
    "page": "Synthesis",
    "title": "ControlSystems.dlqr",
    "category": "function",
    "text": "dlqr(A, B, Q, R), dlqr(sys, Q, R)\n\nCalculate the optimal gain matrix K for the state-feedback law u[k] = K*x[k] that minimizes the cost function:\n\nJ = sum(x\'Qx + u\'Ru, 0, inf).\n\nFor the discrte time model x[k+1] = Ax[k] + Bu[k].\n\nSee also lqg\n\nUsage example:\n\nusing LinearAlgebra # For identity matrix I\nh = 0.1\nA = [1 h; 0 1]\nB = [0;1]\nC = [1 0]\nsys = ss(A,B,C,0, h)\nQ = I\nR = I\nL = dlqr(A,B,Q,R) # lqr(sys,Q,R) can also be used\n\nu(t,x) = -L*x # Form control law,\nt=0:h:5\nx0 = [1,0]\ny, t, x, uout = lsim(sys,u,t,x0)\nplot(t,x, lab=[\"Position\", \"Velocity\"]\', xlabel=\"Time [s]\")\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.dlyap",
    "page": "Synthesis",
    "title": "ControlSystems.dlyap",
    "category": "function",
    "text": "dlyap(A, Q)\n\nCompute the solution X to the discrete Lyapunov equation AXA\' - X + Q = 0.\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.kalman",
    "page": "Synthesis",
    "title": "ControlSystems.kalman",
    "category": "function",
    "text": "kalman(A, C, R1, R2) kalman(sys, R1, R2)`\n\nCalculate the optimal Kalman gain\n\nSee also LQG\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.laglink",
    "page": "Synthesis",
    "title": "ControlSystems.laglink",
    "category": "function",
    "text": "laglink(a, M; h=0)\n\nReturns a phase retarding link, the rule of thumb a = 0.1ωc guarantees less than 6 degrees phase margin loss. The bode curve will go from M, bend down at a/M and level out at 1 for frequencies > a\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.leadlink",
    "page": "Synthesis",
    "title": "ControlSystems.leadlink",
    "category": "function",
    "text": "leadlink(b, N, K; h=0)\n\nReturns a phase advancing link, the top of the phase curve is located at ω = b√(N) where the link amplification is K√(N) The bode curve will go from K, bend up at b and level out at KN for frequencies > bN\n\nThe phase advance at ω = b√(N) can be plotted as a function of N with leadlinkcurve()\n\nValues of N < 1 will give a phase retarding link.\n\nSee also leadlinkat laglink\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.leadlinkat",
    "page": "Synthesis",
    "title": "ControlSystems.leadlinkat",
    "category": "function",
    "text": "leadlinkat(ω, N, K; h=0)\n\nReturns a phase advancing link, the top of the phase curve is located at ω where the link amplification is K√(N) The bode curve will go from K, bend up at ω/√(N) and level out at KN for frequencies > ω√(N)\n\nThe phase advance at ω can be plotted as a function of N with leadlinkcurve()\n\nValues of N < 1 will give a phase retarding link.\n\nSee also leadlink laglink\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.loopshapingPI",
    "page": "Synthesis",
    "title": "ControlSystems.loopshapingPI",
    "category": "function",
    "text": "kp,ki,C = loopshapingPI(P,ωp; ϕl,rl, phasemargin)\n\nSelects the parameters of a PI-controller such that the Nyquist curve of P at the frequency ωp is moved to rl exp(i ϕl)\n\nIf phasemargin is supplied, ϕl is selected such that the curve is moved to an angle of phasemargin - 180 degrees\n\nIf no rl is given, the magnitude of the curve at ωp is kept the same and only the phase is affected, the same goes for ϕl if no phasemargin is given.\n\nSee also pidplots, stabregionPID\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.lqr",
    "page": "Synthesis",
    "title": "ControlSystems.lqr",
    "category": "function",
    "text": "lqr(A, B, Q, R)\n\nCalculate the optimal gain matrix K for the state-feedback law u = K*x that minimizes the cost function:\n\nJ = integral(x\'Qx + u\'Ru, 0, inf).\n\nFor the continuous time model dx = Ax + Bu.\n\nlqr(sys, Q, R)\n\nSolve the LQR problem for state-space system sys. Works for both discrete and continuous time systems.\n\nSee also LQG\n\nUsage example:\n\nusing LinearAlgebra # For identity matrix I\nA = [0 1; 0 0]\nB = [0;1]\nC = [1 0]\nsys = ss(A,B,C,0)\nQ = I\nR = I\nL = lqr(sys,Q,R)\n\nu(t,x) = -L*x # Form control law,\nt=0:0.1:5\nx0 = [1,0]\ny, t, x, uout = lsim(sys,u,t,x0)\nplot(t,x, lab=[\"Position\", \"Velocity\"]\', xlabel=\"Time [s]\")\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.pid",
    "page": "Synthesis",
    "title": "ControlSystems.pid",
    "category": "function",
    "text": "Calculates and returns a PID controller on transfer function form. time indicates whether or not the parameters are given as gains (default) or as time constants series indicates  whether or not the series form or parallel form (default) is desired\n\nC = pid(; kp=0, ki=0; kd=0, time=false, series=false)\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.place",
    "page": "Synthesis",
    "title": "ControlSystems.place",
    "category": "function",
    "text": "place(A, B, p), place(sys::StateSpace, p)\n\nCalculate gain matrix K such that the poles of (A-BK) in are in p\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.reduce_sys",
    "page": "Synthesis",
    "title": "ControlSystems.reduce_sys",
    "category": "function",
    "text": "Implements REDUCE in the Emami-Naeini & Van Dooren paper. Returns transformed A, B, C, D matrices. These are empty if there are no zeros.\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.rstc",
    "page": "Synthesis",
    "title": "ControlSystems.rstc",
    "category": "function",
    "text": "See ?rstd for the discerte case\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#ControlSystems.rstd",
    "page": "Synthesis",
    "title": "ControlSystems.rstd",
    "category": "function",
    "text": "rstd  Polynomial synthesis in discrete time.\n\nR,S,T=rstd(BPLUS,BMINUS,A,BM1,AM,AO,AR,AS)\n\nR,S,T=rstd(BPLUS,BMINUS,A,BM1,AM,AO,AR)\n\nR,S,T=rstd(BPLUS,BMINUS,A,BM1,AM,AO)\n\nPolynomial synthesis according to CCS ch 10 to design a controller R(q) u(k) = T(q) r(k) - S(q) y(k)\n\nInputs:  BPLUS  : Part of open loop numerator BMINUS : Part of open loop numerator A      : Open loop denominator BM1    : Additional zeros AM     : Closed loop denominator AO     : Observer polynomial AR     : Pre-specified factor of R, e.g integral part [1, -1]^k AS     : Pre-specified factor of S, e.g notch filter [1, 0, w^2]\n\nOutputs: R,S,T  : Polynomials in controller\n\nSee function DAB how the solution to the Diophantine- Aryabhatta-Bezout identity is chosen.\n\nSee Computer-Controlled Systems: Theory and Design, Third Edition Karl Johan Åström, Björn Wittenmark\n\n\n\n\n\n"
},

{
    "location": "lib/synthesis/#Synthesis-1",
    "page": "Synthesis",
    "title": "Synthesis",
    "category": "section",
    "text": "balance\ncare\ndab\ndare\ndkalman\ndlqr\ndlyap\nkalman\nlaglink\nleadlink\nleadlinkat\nloopshapingPI\nlqr\npid\nplace\nreduce_sys\nrstc\nrstd"
},

{
    "location": "lib/timefreqresponse/#",
    "page": "Time and Frequency response",
    "title": "Time and Frequency response",
    "category": "page",
    "text": "Pages = [\"timefreqresponse.md\"]"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.bode",
    "page": "Time and Frequency response",
    "title": "ControlSystems.bode",
    "category": "function",
    "text": "mag, phase, w = bode(sys[, w])\n\nCompute the magnitude and phase parts of the frequency response of system sys at frequencies w\n\nmag and phase has size (length(w), ny, nu)\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.evalfr",
    "page": "Time and Frequency response",
    "title": "ControlSystems.evalfr",
    "category": "function",
    "text": "evalfr(sys, x) Evaluate the transfer function of the LTI system sys at the complex number s=x (continuous-time) or z=x (discrete-time).\n\nFor many values of x, use freqresp instead.\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.freqresp",
    "page": "Time and Frequency response",
    "title": "ControlSystems.freqresp",
    "category": "function",
    "text": "sys_fr = freqresp(sys, w)\n\nEvaluate the frequency response of a linear system\n\nw -> C*((iw*im -A)^-1)*B + D\n\nof system sys over the frequency vector w.\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.impulse",
    "page": "Time and Frequency response",
    "title": "ControlSystems.impulse",
    "category": "function",
    "text": "y, t, x = impulse(sys[, Tf]) or y, t, x = impulse(sys[, t])\n\nCalculate the impulse response of system sys. If the final time Tf or time vector t is not provided, one is calculated based on the system pole locations.\n\ny has size (length(t), ny, nu), x has size (length(t), nx, nu)\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.lsim",
    "page": "Time and Frequency response",
    "title": "ControlSystems.lsim",
    "category": "function",
    "text": "y, t, x = lsim(sys, u, t; x0, method])\n\ny, t, x, uout = lsim(sys, u::Function, t; x0, method)\n\nCalculate the time response of system sys to input u. If x0 is ommitted, a zero vector is used.\n\ny, x, uout has time in the first dimension. Initial state x0 defaults to zero.\n\nContinuous time systems are simulated using an ODE solver if u is a function. If u is an array, the system is discretized before simulation. For a lower level inteface, see ?Simulator and ?solve\n\nu can be a function or a matrix/vector of precalculated control signals. If u is a function, then u(x,i) (u(x,t)) is called to calculate the control signal every iteration (time instance used by solver). This can be used to provide a control law such as state feedback u(x,t) = -L*x calculated by lqr. To simulate a unit step, use (x,i)-> 1, for a ramp, use (x,i)-> i*h, for a step at t=5, use (x,i)-> (i*h >= 5) etc.\n\nUsage example:\n\nusing LinearAlgebra # For identity matrix I\nA = [0 1; 0 0]\nB = [0;1]\nC = [1 0]\nsys = ss(A,B,C,0)\nQ = I\nR = I\nL = lqr(sys,Q,R)\n\nu(x,t) = -L*x # Form control law,\nt=0:0.1:5\nx0 = [1,0]\ny, t, x, uout = lsim(sys,u,t,x0)\nplot(t,x, lab=[\"Position\", \"Velocity\"]\', xlabel=\"Time [s]\")\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#ControlSystems.nyquist",
    "page": "Time and Frequency response",
    "title": "ControlSystems.nyquist",
    "category": "function",
    "text": "re, im, w = nyquist(sys[, w])\n\nCompute the real and imaginary parts of the frequency response of system sys at frequencies w\n\nre and im has size (length(w), ny, nu)\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#Base.step",
    "page": "Time and Frequency response",
    "title": "Base.step",
    "category": "function",
    "text": "y, t, x = step(sys[, Tf]) or y, t, x = step(sys[, t])\n\nCalculate the step response of system sys. If the final time Tf or time vector t is not provided, one is calculated based on the system pole locations.\n\ny has size (length(t), ny, nu), x has size (length(t), nx, nu)\n\n\n\n\n\n"
},

{
    "location": "lib/timefreqresponse/#Time-and-Frequency-response-1",
    "page": "Time and Frequency response",
    "title": "Time and Frequency response",
    "category": "section",
    "text": "Any TransferFunction can be evaluated at a point using F(s), F(omega, true), F(z, false)F(s) evaluates the continuous-time transfer function F at s.\nF(omega,true) evaluates the discrete-time transfer function F at exp(i*Ts*omega)\nF(z,false) evaluates the discrete-time transfer function F at zbode\nevalfr\nfreqresp\nimpulse\nlsim\nnyquist\nstep"
},

{
    "location": "man/creatingtfs/#",
    "page": "Creating Transfer Functions",
    "title": "Creating Transfer Functions",
    "category": "page",
    "text": ""
},

{
    "location": "man/creatingtfs/#Creating-Transfer-Functions-1",
    "page": "Creating Transfer Functions",
    "title": "Creating Transfer Functions",
    "category": "section",
    "text": "DocTestSetup = quote\n    using ControlSystems\nend"
},

{
    "location": "man/creatingtfs/#tf-Rational-Representation-1",
    "page": "Creating Transfer Functions",
    "title": "tf - Rational Representation",
    "category": "section",
    "text": "The syntax for creating a transfer function istf(num, den, Ts=0)where num and den are the polinomial coefficients of the numerator and denominator of the polynomial and Ts is the sample time."
},

{
    "location": "man/creatingtfs/#Example:-1",
    "page": "Creating Transfer Functions",
    "title": "Example:",
    "category": "section",
    "text": "tf([1],[1,2,1])\n\n# output\n\nTransferFunction:\n      1.0\n----------------\ns^2 + 2.0s + 1.0\n\nContinuous-time transfer function modelThe transfer functions created using this method will be of type TransferFunction{SisoRational}."
},

{
    "location": "man/creatingtfs/#zpk-Pole-Zero-Gain-Representation-1",
    "page": "Creating Transfer Functions",
    "title": "zpk - Pole-Zero-Gain Representation",
    "category": "section",
    "text": "Sometimes it\'s better to represent the transferfunction by its poles, zeros and gain, this can be done usingzpk(zeros, poles, gain, Ts=0)where zeros and poles are Vectors of the zeros and poles for the system and gain is a gain coefficient."
},

{
    "location": "man/creatingtfs/#Example-1",
    "page": "Creating Transfer Functions",
    "title": "Example",
    "category": "section",
    "text": "zpk([-1,1], [-5, -10], 2)\n\n# output\n\nTransferFunction:\n   (s - 1.0)(s + 1.0)\n2.0-------------------\n   (s + 10.0)(s + 5.0)\n\nContinuous-time transfer function modelThe transfer functions created using this method will be of type TransferFunction{SisoZpk}."
},

{
    "location": "man/creatingtfs/#Converting-between-types-1",
    "page": "Creating Transfer Functions",
    "title": "Converting between types",
    "category": "section",
    "text": "It is sometime useful to convert one representation to another, this is possible using the same functions, for exampletf(zpk([-1], [1], 2, 0.1))\n\n# output\n\nTransferFunction:\n2.0z + 2.0\n----------\n z - 1.0\n\nSample Time: 0.1 (seconds)\nDiscrete-time transfer function model"
},

{
    "location": "man/introduction/#",
    "page": "Introduction",
    "title": "Introduction",
    "category": "page",
    "text": ""
},

{
    "location": "man/introduction/#Introduction-1",
    "page": "Introduction",
    "title": "Introduction",
    "category": "section",
    "text": ""
},

{
    "location": "man/introduction/#Installation-1",
    "page": "Introduction",
    "title": "Installation",
    "category": "section",
    "text": "To install this package simply runPkg.add(\"ControlSystems\")"
},

{
    "location": "man/introduction/#Basic-functions-1",
    "page": "Introduction",
    "title": "Basic functions",
    "category": "section",
    "text": "DocTestSetup = quote\n    using ControlSystems\n    P = tf([1],[1,1])\n    T = P/(1+P)\nendTransfer functions can easily be created using the function tf(num, den, Ts=0), where num and den are vectors representing the numerator and denominator of a rational function. See tf or the section \"Creating Transfer Functions\" for more info. These functions can then be connected and modified using the operators +,-,*,/ and functions like append.Example:P = tf([1],[1,1])\nT = P/(1+P)\n\n# output\n\nTransferFunction:\n    s + 1.0\n----------------\ns^2 + 3.0s + 2.0\n\nContinuous-time transfer function modelNotice that the poles are not canceled automatically, to do this, the function minreal is availableminreal(T)\n\n# output\n\nTransferFunction:\n  1.0\n-------\ns + 2.0\n\nContinuous-time transfer function model"
},

{
    "location": "man/introduction/#Plotting-1",
    "page": "Introduction",
    "title": "Plotting",
    "category": "section",
    "text": "Plotting requires some extra care. The ControlSystems package is using Plots.jl (link) as interface to generate all the plots. This means that the user is able to freely choose back-end. The plots in this manual are generated using PyPlot. If you have several back-ends for plotting then you can select the one you want to use with the corresponding Plots call (for PyPlot this is Plots.pyplot(), some alternatives are immerse(), gadfly(), plotly()). A simple example where we generate a plot using immerse and save it to a file isusing ControlSystems\nPlots.immerse()\n\nfig = bodeplot(tf(1,[1,2,1]))\n\nPlots.savefig(fig, \"myfile.svg\")"
},

]}
